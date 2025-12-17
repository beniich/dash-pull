import { useState } from 'react';
import { format, addDays, startOfWeek, addHours, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { useHospitalStore } from "@/stores/useHospitalStore";
import { GoogleCalendarService, CalendarEvent } from '@/components/calendar/GoogleCalendarService';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


export const AgendaView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
    const [googleEvents, setGoogleEvents] = useState<CalendarEvent[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    // Connect to store
    const appointments = useHospitalStore((state) => state.appointments);
    const updateAppointment = useHospitalStore((state) => state.updateAppointment);

    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSaveEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEvent) return;

        updateAppointment(editingEvent.id, {
            ...editingEvent,
            duration: Number(editingEvent.duration) // Ensure number
        });
        setIsDialogOpen(false);
        toast.success("Rendez-vous mis à jour");
    };

    const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 07:00 to 19:00

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'surgery': return 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300';
            case 'consultation': return 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300';
            case 'urgent': return 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300';
            case 'google': return 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300';
            default: return 'bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-300';
        }
    };

    const handleConnectGoogle = async () => {
        setIsSyncing(true);
        const connected = await GoogleCalendarService.connect();
        if (connected) {
            const events = await GoogleCalendarService.fetchEvents();
            setGoogleEvents(events);
        }
        setIsSyncing(false);
    };

    // Merge internal and google events for display
    // Merge internal and google events for display
    const allEvents = [
        ...appointments.map(a => ({ ...a, source: 'Internal' })),
        ...googleEvents.map(g => ({ ...g, duration: (g.end.getTime() - g.start.getTime()) / (1000 * 60 * 60), doctor: g.source, room: 'Google' }))
    ];

    return (
        <Card className="glass-card overflow-hidden flex flex-col h-[700px]">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold capitalize text-foreground">
                        {format(currentDate, 'EEEE d MMMM yyyy', { locale: fr })}
                    </h2>
                    <div className="flex items-center rounded-md border border-border/50 bg-background/50">
                        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addDays(currentDate, -1))}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
                            Aujourd'hui
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 1))}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-900"
                        onClick={handleConnectGoogle}
                        disabled={isSyncing}
                    >
                        {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <img src="https://www.google.com/favicon.ico" className="h-4 w-4" alt="G" />}
                        {googleEvents.length > 0 ? 'Synchronisé' : 'Sync Google Agenda'}
                    </Button>

                    <div className="flex bg-muted/20 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('day')}
                            className={cn("px-3 py-1 text-sm rounded-md transition-all", viewMode === 'day' ? "bg-white shadow-sm text-primary font-medium" : "text-muted-foreground hover:text-foreground")}
                        >
                            Jour
                        </button>
                        <button
                            onClick={() => setViewMode('week')}
                            className={cn("px-3 py-1 text-sm rounded-md transition-all", viewMode === 'week' ? "bg-white shadow-sm text-primary font-medium" : "text-muted-foreground hover:text-foreground")}
                        >
                            Semaine
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Body */}
            <div className="flex-1 overflow-y-auto relative">
                {/* Time Grid */}
                <div className="relative min-h-[800px]">
                    {hours.map((hour) => (
                        <div key={hour} className="flex border-b border-border/30 h-[80px]">
                            <div className="w-16 flex-shrink-0 border-r border-border/30 flex justify-center pt-2">
                                <span className="text-xs font-medium text-muted-foreground">{hour}:00</span>
                            </div>
                            <div className="flex-1 relative group">
                                <div className="absolute inset-0 group-hover:bg-slate-50/50 dark:group-hover:bg-slate-800/20 transition-colors" />
                            </div>
                        </div>
                    ))}

                    {/* Events Overlay */}
                    {allEvents.map((apt) => {
                        const startHour = apt.start.getHours();
                        const startMinutes = apt.start.getMinutes();
                        // Handle events outside 7am-7pm visually later if needed, for now clamp
                        if (startHour < 7) return null;

                        const topPosition = ((startHour - 7) * 80) + ((startMinutes / 60) * 80);
                        // @ts-ignore
                        const height = apt.duration * 80;

                        // Don't make Google events editable yet
                        if (apt.type === 'google') {
                            return (
                                <div
                                    key={apt.id}
                                    className={cn("absolute left-20 right-4 rounded-lg border p-3 cursor-pointer hover:shadow-lg transition-all border-l-4", getTypeColor(apt.type))}
                                    style={{ top: `${topPosition}px`, height: `${height}px` }}
                                >
                                    {/* Content same as before */}
                                    <div className="flex flex-col h-full">
                                        <div className="flex justify-between items-start">
                                            <span className="font-semibold text-sm">{apt.title}</span>
                                            <span className="text-xs opacity-70 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {format(apt.start, 'HH:mm')} - {format(addHours(apt.start, Number(apt.duration)), 'HH:mm')}
                                            </span>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between text-xs opacity-80 pt-2 border-t border-black/5 dark:border-white/5">
                                            <div className="flex items-center gap-1"><User className="h-3 w-3" />{apt.doctor}</div>
                                            <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{apt.room}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Dialog key={apt.id} open={isDialogOpen && editingEvent?.id === apt.id} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (open) setEditingEvent(apt);
                            }}>
                                <DialogTrigger asChild>
                                    <div
                                        className={cn(
                                            "absolute left-20 right-4 rounded-lg border p-3 cursor-pointer hover:shadow-lg transition-all border-l-4",
                                            getTypeColor(apt.type)
                                        )}
                                        style={{ top: `${topPosition}px`, height: `${height}px` }}
                                    >
                                        <div className="flex flex-col h-full">
                                            <div className="flex justify-between items-start">
                                                <span className="font-semibold text-sm">{apt.title}</span>
                                                <span className="text-xs opacity-70 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {format(apt.start, 'HH:mm')} - {format(addHours(apt.start, Number(apt.duration)), 'HH:mm')}
                                                </span>
                                            </div>
                                            <div className="mt-auto flex items-center justify-between text-xs opacity-80 pt-2 border-t border-black/5 dark:border-white/5">
                                                <div className="flex items-center gap-1"><User className="h-3 w-3" />{apt.doctor}</div>
                                                <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{apt.room}</div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Modifier le rendez-vous</DialogTitle>
                                        <DialogDescription>Changer les détails de l'intervention ou de la consultation.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSaveEvent} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Titre</Label>
                                            <Input
                                                value={editingEvent?.title || ''}
                                                onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Médecin</Label>
                                                <Input
                                                    value={editingEvent?.doctor || ''}
                                                    onChange={e => setEditingEvent({ ...editingEvent, doctor: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Salle</Label>
                                                <Input
                                                    value={editingEvent?.room || ''}
                                                    onChange={e => setEditingEvent({ ...editingEvent, room: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit">Enregistrer</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        );
                    })}

                    {/* Current Time Indicator */}
                    <div
                        className="absolute left-16 right-0 border-t-2 border-red-500 z-10 flex items-center pointer-events-none"
                        style={{ top: `${((new Date().getHours() - 7) * 80) + ((new Date().getMinutes() / 60) * 80)}px` }}
                    >
                        <div className="h-2 w-2 rounded-full bg-red-500 -ml-1" />
                    </div>
                </div>
            </div>
        </Card>
    );
};
