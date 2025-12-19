import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, Trash2, CheckCheck, X } from 'lucide-react';
import { useNotificationStore, getNotificationStyle, getPriorityStyle } from '@/stores/useNotificationStore';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const NotificationCenter: React.FC = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification
    } = useNotificationStore();

    const handleNotificationClick = (notif: typeof notifications[0]) => {
        markAsRead(notif.id);
        if (notif.link) {
            navigate(notif.link);
            setOpen(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] animate-pulse"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-96 p-0" align="end">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-primary" />
                        <span className="font-semibold">Notifications</span>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {unreadCount} nouvelles
                            </Badge>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs gap-1 h-7"
                            onClick={markAllAsRead}
                        >
                            <CheckCheck className="h-3 w-3" />
                            Tout lire
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <ScrollArea className="h-[350px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                            <Bell className="h-10 w-10 mb-2 opacity-20" />
                            <p className="text-sm">Aucune notification</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/30">
                            {notifications.map((notif) => {
                                const style = getNotificationStyle(notif.type);
                                const priorityStyle = getPriorityStyle(notif.priority);

                                return (
                                    <div
                                        key={notif.id}
                                        className={cn(
                                            'p-3 hover:bg-muted/50 transition-colors cursor-pointer relative group',
                                            priorityStyle,
                                            !notif.read && 'bg-primary/5'
                                        )}
                                        onClick={() => handleNotificationClick(notif)}
                                    >
                                        <div className="flex gap-3">
                                            <span className="text-lg">{style.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className={cn('font-medium text-sm', !notif.read && 'text-foreground')}>
                                                        {notif.title}
                                                    </span>
                                                    {!notif.read && (
                                                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground/70 mt-1">
                                                    {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true, locale: fr })}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!notif.read && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                                                    >
                                                        <Check className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                                    onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>

                {/* Footer */}
                <div className="p-2 border-t border-border/50 text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-muted-foreground"
                        onClick={() => setOpen(false)}
                    >
                        Fermer
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationCenter;
