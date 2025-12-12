import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { PipelineColumn } from "@/components/PipelineColumn";
import { DealCard } from "@/components/DealCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DealDialog } from "@/components/DealDialog";

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  contact: string;
  stage: string;
  probability: number;
  closeDate: string;
}

const stages = [
  { id: "prospect", name: "Prospect", color: "bg-info/10 border-info/20" },
  { id: "qualification", name: "Qualification", color: "bg-warning/10 border-warning/20" },
  { id: "proposition", name: "Proposition", color: "bg-primary/10 border-primary/20" },
  { id: "negociation", name: "Négociation", color: "bg-accent/10 border-accent/20" },
  { id: "gagne", name: "Gagné", color: "bg-success/10 border-success/20" },
  { id: "perdu", name: "Perdu", color: "bg-destructive/10 border-destructive/20" },
];

export function DealsPipeline() {
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchDeals = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select(`
          *,
          customers(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedDeals: Deal[] = (data as any[] || []).map((deal) => ({
        id: deal.id,
        title: deal.title,
        company: deal.customers?.name || "N/A",
        value: Number(deal.value),
        contact: deal.contact || "",
        stage: deal.stage,
        probability: deal.probability || 0,
        closeDate: deal.close_date || "",
      }));

      setDeals(formattedDeals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les opportunités",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const deal = deals.find((d) => d.id === event.active.id);
    if (deal) {
      setActiveDeal(deal);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveDeal(null);
      return;
    }

    const dealId = active.id as string;
    const newStage = over.id as string;

    // Optimistic update
    setDeals((prevDeals) =>
      prevDeals.map((deal) =>
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      )
    );

    // Update in database
    try {
      const { error } = await supabase
        .from("deals")
        .update({ stage: newStage })
        .eq("id", dealId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Opportunité mise à jour",
      });
    } catch (error) {
      console.error("Error updating deal:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'opportunité",
        variant: "destructive",
      });
      // Revert optimistic update
      fetchDeals();
    }

    setActiveDeal(null);
  };

  const getDealsByStage = (stageId: string) => {
    return deals.filter((deal) => deal.stage === stageId);
  };

  const getTotalValueByStage = (stageId: string) => {
    return getDealsByStage(stageId).reduce((sum, deal) => sum + deal.value, 0);
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Opportunité
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <PipelineColumn
              key={stage.id}
              stage={stage}
              deals={getDealsByStage(stage.id)}
              totalValue={getTotalValueByStage(stage.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDeal ? (
            <div className="rotate-3 opacity-90">
              <DealCard deal={activeDeal} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <DealDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchDeals}
      />
    </>
  );
}
