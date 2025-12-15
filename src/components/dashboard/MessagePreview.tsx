
import { mockMessages } from "@/lib/mockData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, Circle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const MessagePreview = () => {
    const unreadCount = mockMessages.filter(m => m.unread).length;

    return (
        <Card className="glass-card mb-6 border-none shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Messages
                </CardTitle>
                {unreadCount > 0 && (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground animate-in zoom-in">
                        {unreadCount}
                    </span>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {mockMessages.map((msg) => (
                        <div key={msg.id} className="flex gap-4 p-2 rounded-lg hover:bg-muted/50 items-start cursor-pointer group">
                            <Avatar className="h-9 w-9 border border-background">
                                <AvatarImage src={msg.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {msg.sender.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium leading-none">{msg.sender}</p>
                                    <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
                                    {msg.content}
                                </p>
                                <p className="text-[10px] text-primary/70 font-medium">#{msg.channel}</p>
                            </div>
                            {msg.unread && (
                                <Circle className="h-2 w-2 fill-primary text-primary mt-1.5" />
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
