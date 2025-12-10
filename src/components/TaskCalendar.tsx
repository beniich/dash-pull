import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  due_date?: string;
}

interface TaskCalendarProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const statusColors = {
  todo: "bg-yellow-500",
  in_progress: "bg-amber-500",
  done: "bg-green-500",
};

const statusLabels = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminé",
};

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-orange-500",
  high: "bg-red-500",
};

export function TaskCalendar({ tasks, onTaskClick }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const tasksWithDates = tasks.filter((t) => t.due_date);
  const tasksForSelectedDate = selectedDate
    ? tasksWithDates.filter((t) => isSameDay(new Date(t.due_date!), selectedDate))
    : [];

  const datesWithTasks = tasksWithDates.map((t) => new Date(t.due_date!));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            className="rounded-md border"
            modifiers={{
              hasTask: datesWithTasks,
            }}
            modifiersStyles={{
              hasTask: {
                fontWeight: "bold",
                backgroundColor: "hsl(var(--primary) / 0.1)",
                borderRadius: "50%",
              },
            }}
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">
            Tâches du {selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: fr }) : "jour sélectionné"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasksForSelectedDate.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune tâche prévue pour cette date
            </div>
          ) : (
            <div className="space-y-3">
              {tasksForSelectedDate.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${statusColors[task.status]} text-white`}>
                        {statusLabels[task.status]}
                      </Badge>
                      <Badge className={`${priorityColors[task.priority]} text-white`}>
                        {task.priority === "high" ? "!" : task.priority === "medium" ? "•" : "○"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
