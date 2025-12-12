import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, X, Tag } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Task, Subtask } from "@/pages/Tasks";
import { Badge } from "@/components/ui/badge";



interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSave: (task: Omit<Task, "id" | "user_id">) => void;
}

export function TaskDialog({ open, onOpenChange, task, onSave }: TaskDialogProps) {
  const [formData, setFormData] = useState<Omit<Task, "id" | "user_id">>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    due_date: undefined,
    subtasks: [],
    tags: []
  });
  const [newTag, setNewTag] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        due_date: task.due_date,
        subtasks: task.subtasks || [],
        tags: task.tags || []
      });
      setDate(task.due_date ? new Date(task.due_date) : undefined);
    } else {
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        due_date: undefined,
        subtasks: [],
        tags: []
      });
      setDate(undefined);
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      due_date: date?.toISOString().split("T")[0],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Modifier la tâche" : "Nouvelle tâche"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre de la tâche"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de la tâche"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "todo" | "in_progress" | "done") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">À faire</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="done">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date d'échéance</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "d MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={fr}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Subtasks Section */}
            <div className="space-y-3">
              <Label>Sous-tâches</Label>
              <div className="flex gap-2">
                <Input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Ajouter une sous-tâche..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newSubtask.trim()) {
                        setFormData({
                          ...formData,
                          subtasks: [...(formData.subtasks || []), { id: Date.now().toString(), title: newSubtask, completed: false }]
                        });
                        setNewSubtask("");
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newSubtask.trim()) {
                      setFormData({
                        ...formData,
                        subtasks: [...(formData.subtasks || []), { id: Date.now().toString(), title: newSubtask, completed: false }]
                      });
                      setNewSubtask("");
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.subtasks?.map((subtask, index) => (
                  <div key={subtask.id || index} className="flex items-center justify-between bg-muted/50 p-2 rounded text-sm">
                    <span>{subtask.title}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        const newSubtasks = [...(formData.subtasks || [])];
                        newSubtasks.splice(index, 1);
                        setFormData({ ...formData, subtasks: newSubtasks });
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ajouter un tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
                        setFormData({
                          ...formData,
                          tags: [...(formData.tags || []), newTag.trim()]
                        });
                        setNewTag("");
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
                      setFormData({
                        ...formData,
                        tags: [...(formData.tags || []), newTag.trim()]
                      });
                      setNewTag("");
                    }
                  }}
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => {
                        const newTags = [...(formData.tags || [])];
                        newTags.splice(index, 1);
                        setFormData({ ...formData, tags: newTags });
                      }}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {task ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
