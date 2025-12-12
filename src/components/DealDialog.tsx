import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface Customer {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
}

export const DealDialog = ({ open, onOpenChange, onSuccess }: DealDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    company_id: "",
    value: "",
    contact: "",
    stage: "prospect",
    probability: "20",
    close_date: "",
    product_id: "",
  });

  useEffect(() => {
    if (open) {
      fetchCustomers();
      fetchProducts();
    }
  }, [open]);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from("customers")
      .select("id, name")
      .order("name");
    setCustomers((data as unknown as Customer[]) || []);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("id, name")
      .order("name");
    setProducts((data as unknown as Product[]) || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("deals").insert([
        {
          title: formData.title,
          company_id: formData.company_id || null,
          value: parseFloat(formData.value) || 0,
          contact: formData.contact || null,
          stage: formData.stage,
          probability: parseInt(formData.probability) || 0,
          close_date: formData.close_date || null,
          product_id: formData.product_id || null,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Opportunité créée avec succès",
      });

      onSuccess();
      onOpenChange(false);
      setFormData({
        title: "",
        company_id: "",
        value: "",
        contact: "",
        stage: "prospect",
        probability: "20",
        close_date: "",
        product_id: "",
      });
    } catch (error) {
      console.error("Error creating deal:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'opportunité",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle Opportunité</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle opportunité commerciale
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_id">Client</Label>
              <Select
                value={formData.company_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, company_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Valeur (€) *</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Étape</Label>
              <Select
                value={formData.stage}
                onValueChange={(value) =>
                  setFormData({ ...formData, stage: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="qualification">Qualification</SelectItem>
                  <SelectItem value="proposition">Proposition</SelectItem>
                  <SelectItem value="negociation">Négociation</SelectItem>
                  <SelectItem value="gagne">Gagné</SelectItem>
                  <SelectItem value="perdu">Perdu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="probability">Probabilité (%)</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) =>
                  setFormData({ ...formData, probability: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="close_date">Date de clôture</Label>
              <Input
                id="close_date"
                type="date"
                value={formData.close_date}
                onChange={(e) =>
                  setFormData({ ...formData, close_date: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_id">Produit</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, product_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
