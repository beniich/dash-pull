
import { mockDeals } from "@/lib/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Hash, Lock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatSidebarProps {
    activeChannelId: string;
    onSelectChannel: (id: string) => void;
}

export const ChatSidebar = ({ activeChannelId, onSelectChannel }: ChatSidebarProps) => {
    // Mock conversations derived from Projects (Deals)
    const conversations = mockDeals.map(deal => ({
        id: deal.id, // In real app, would be a conversation ID linked to deal
        name: deal.title,
        status: deal.stage,
        unread: Math.random() > 0.7 // Random unread status for demo
    }));

    return (
        <div className="w-80 border-r border-border/50 bg-muted/10 flex flex-col h-full bg-background/50">
            <div className="p-4 border-b border-border/50 space-y-4">
                <h2 className="font-semibold px-2 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Messagerie Sécurisée
                </h2>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher..."
                        className="pl-9 h-9 bg-background/50 border-border/50 text-sm"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projets Actifs</p>
                    {conversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => onSelectChannel(conv.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all text-left",
                                activeChannelId === conv.id
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                        >
                            <div className={cn(
                                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                activeChannelId === conv.id ? "bg-primary/20" : "bg-muted"
                            )}>
                                <Hash className="h-4 w-4" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate">{conv.name}</p>
                            </div>
                            {conv.unread && (
                                <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
