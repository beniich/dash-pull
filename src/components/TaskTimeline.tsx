import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isAfter, isBefore } from "date-fns";
import { fr } from "date-fns/locale";
import { Task } from "@/pages/Tasks";

interface TaskTimelineProps {
    tasks: Task[];
    onTaskClick?: (task: Task) => void;
}

export function TaskTimeline({ tasks, onTaskClick }: TaskTimelineProps) {
    const today = new Date();
    const startDate = startOfWeek(today, { locale: fr });
    const endDate = addDays(startDate, 13); // 2 weeks view

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getTaskStyle = (task: Task) => {
        switch (task.priority) {
            case "high": return "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400";
            case "medium": return "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400";
            case "low": return "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400";
            default: return "bg-gray-500/10 border-gray-500/20 text-gray-600";
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg">Timeline (Vue 2 semaines)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex flex-col min-w-[800px]">
                        {/* Header Dates */}
                        <div className="flex border-b">
                            <div className="w-48 p-4 shrink-0 font-semibold text-muted-foreground border-r bg-muted/30">
                                Tâche
                            </div>
                            {days.map((day) => (
                                <div
                                    key={day.toISOString()}
                                    className={`w-24 p-2 text-center border-r text-sm ${isSameDay(day, today) ? "bg-primary/5 font-bold text-primary" : ""
                                        }`}
                                >
                                    <div className="uppercase text-xs text-muted-foreground">
                                        {format(day, "EEE", { locale: fr })}
                                    </div>
                                    <div>{format(day, "d")}</div>
                                </div>
                            ))}
                        </div>

                        {/* Tasks Rows */}
                        <div className="flex flex-col">
                            {tasks.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">Aucune tâche active</div>
                            ) : (
                                tasks.map((task) => {
                                    const taskDate = task.due_date ? new Date(task.due_date) : null;

                                    return (
                                        <div
                                            key={task.id}
                                            className="flex border-b hover:bg-muted/50 transition-colors cursor-pointer group"
                                            onClick={() => onTaskClick?.(task)}
                                        >
                                            <div className="w-48 p-3 shrink-0 border-r flex flex-col justify-center overflow-hidden">
                                                <div className="font-medium truncate text-sm">{task.title}</div>
                                                <div className="flex gap-1 mt-1">
                                                    {task.tags?.slice(0, 2).map(tag => (
                                                        <Badge key={tag} variant="outline" className="text-[10px] h-4 px-1">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {days.map((day) => {
                                                const isTaskDay = taskDate && isSameDay(taskDate, day);
                                                const isOverdue = taskDate && isBefore(taskDate, today) && task.status !== 'done';

                                                return (
                                                    <div key={day.toISOString()} className="w-24 border-r relative p-1 h-16">
                                                        {isTaskDay && (
                                                            <div className={`
                                h-full w-full rounded-md border p-1 text-xs whitespace-normal leading-tight
                                ${getTaskStyle(task)}
                                ${task.status === 'done' ? 'opacity-50' : ''}
                              `}>
                                                                {task.priority === 'high' && <span className="mr-1">🔥</span>}
                                                                {task.status === 'done' && <span className="mr-1">✓</span>}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
