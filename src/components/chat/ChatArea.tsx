
import { mockMessages, MockMessage } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lock, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatAreaProps {
    channelId: string;
}

export const ChatArea = ({ channelId }: ChatAreaProps) => {
    // Filter messages for this channel (mock logic, simplified)
    const messages = mockMessages.filter(m =>
        channelId === 'all' || m.channel_id === channelId || m.channel === 'System'
    );

    return (
        <ScrollArea className="flex-1 p-6 h-[calc(100vh-220px)]">
            <div className="space-y-6">
                <div className="flex items-center justify-center mb-8">
                    <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Lock className="h-3 w-3" />
                        Chiffrement de bout en bout activé
                    </span>
                </div>

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-3 max-w-[80%]",
                            msg.sender === "System" ? "mx-auto max-w-full justify-center" : "",
                            msg.sender === "Me" ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        {msg.sender !== "System" && (
                            <Avatar className="h-8 w-8 mt-1 border border-background shadow-sm">
                                <AvatarImage src={msg.avatar} />
                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                    {msg.sender.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        )}

                        <div className={cn(
                            "space-y-1",
                            msg.sender === "System" ? "text-center w-full" : ""
                        )}>
                            {msg.sender !== "System" && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-foreground/80">{msg.sender}</span>
                                    <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                                </div>
                            )}

                            {msg.type === 'system' ? (
                                <div className="bg-muted/50 border border-border/50 text-muted-foreground text-sm py-1.5 px-4 rounded-full inline-block">
                                    {msg.content}
                                </div>
                            ) : (
                                <div className={cn(
                                    "p-3 rounded-2xl shadow-sm text-sm",
                                    "bg-white dark:bg-card border border-border/50 text-card-foreground",
                                    msg.type === 'file' ? "pr-4" : ""
                                )}>
                                    {msg.content}

                                    {msg.type === 'file' && msg.attachment && (
                                        <div className="mt-3 flex items-center gap-3 p-2 rounded-xl bg-muted/50 border border-border/50 group cursor-pointer hover:bg-muted transition-colors">
                                            <div className="h-10 w-10 flex items-center justify-center bg-background rounded-lg text-primary">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-sm font-medium truncate">{msg.attachment.name}</p>
                                                <p className="text-xs text-muted-foreground uppercase">{msg.attachment.size} • {msg.attachment.type}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-primary">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};
