
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Plus, Send, FileText } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const MessageInput = () => {
    return (
        <div className="p-4 bg-background/50 border-t border-border/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-full bg-background hover:bg-muted/50 transition-colors">
                            <Plus className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuItem className="cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Générer Facture</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Partager Contrat</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex-1 relative">
                    <Input
                        placeholder="Écrivez un message sécurisé..."
                        className="pr-12 h-10 rounded-full border-border/50 bg-background hover:border-primary/30 focus-visible:ring-primary/20 transition-all font-normal"
                    />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Paperclip className="h-4 w-4" />
                    </Button>
                </div>

                <Button className="h-10 w-10 rounded-full shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
