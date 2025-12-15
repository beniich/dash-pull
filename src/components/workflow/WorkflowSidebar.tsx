import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, CreditCard, Mail, Database, MessageSquare, LayoutDashboard, ArrowRightCircle, FileSpreadsheet, Hash, BadgeDollarSign, Split, Clock } from "lucide-react";
import { useRef } from 'react';

export const WorkflowSidebar = () => {
    const dragImageRef = useRef<HTMLDivElement>(null);
    const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        // Set data for React Flow
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/reactflow-label', label);
        event.dataTransfer.effectAllowed = 'move';
        // Use a custom drag image (transparent) to avoid default ghost image
        if (dragImageRef.current) {
            event.dataTransfer.setDragImage(dragImageRef.current, 0, 0);
        }
    };

    const draggables = [
        { type: 'trigger', label: 'Déclencheur', icon: Zap, description: "Nouveau lead, Deal gagné..." },
        { type: 'script', label: 'Script', icon: Database, description: "Code Javascript" },
        { type: 'condition', label: 'Condition', icon: Split, description: "Si / Sinon" },
        { type: 'delay', label: 'Délai', icon: Clock, description: "Attendre X temps" },
        { type: 'sheets', label: 'Google Sheets', icon: FileSpreadsheet, description: "Lire / Écrire" },
        { type: 'slack', label: 'Slack', icon: Hash, description: "Envoyer un message" },
        { type: 'stripe', label: 'Stripe', icon: BadgeDollarSign, description: "Paiements" },
        { type: 'email', label: 'Email', icon: Mail, description: "Envoyer un e-mail" },
        { type: 'database', label: 'API Webhook', icon: Database, description: "Appel HTTP externe" },
        { type: 'iframe', label: 'Iframe View', icon: LayoutDashboard, description: "Intégration externe" },
        { type: 'redirect', label: 'Redirection', icon: ArrowRightCircle, description: "Rediriger l'utilisateur" },
        { type: 'notification', label: 'Notification', icon: MessageSquare, description: "Notifier un utilisateur" },
    ];


    return (
        <Card className="w-64 border-l bg-background/50 h-full backdrop-blur-sm shadow-neu-left flex flex-col">
            <div className="p-4 border-b">
                <div className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                    Bibliothèque
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-3 pb-4">
                    {/* Hidden element used as custom drag image */}
                    <div ref={dragImageRef} className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none" />
                    {draggables.map((item) => (
                        <div
                            key={item.type}
                            className="flex items-start gap-3 p-3 rounded-lg border bg-card cursor-grab hover:shadow-md transition-all active:cursor-grabbing"
                            onDragStart={(event) => onDragStart(event, item.type, item.label)}
                            draggable
                        >
                            <div className="mt-1 p-1.5 rounded bg-primary/10 text-primary">
                                <item.icon size={16} />
                            </div>
                            <div>
                                <div className="font-medium text-sm">{item.label}</div>
                                <div className="text-xs text-muted-foreground leading-tight mt-0.5">
                                    {item.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-4 border-t mt-auto bg-background/50">
                <div className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                    Aide
                </div>
                <p className="text-xs text-muted-foreground">
                    Glissez-déposez les éléments sur la zone de travail pour construire votre automatisation.
                </p>
            </div>
        </Card>
    );
};
