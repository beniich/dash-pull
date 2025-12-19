import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Bot,
    Send,
    Loader2,
    Sparkles,
    Brain,
    Stethoscope,
    FileText,
    AlertTriangle
} from 'lucide-react';
import { useHospitalStore } from '@/stores/useHospitalStore';

export const AIAssistantWidget: React.FC = () => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const patients = useHospitalStore((state) => state.patients);

    const quickActions = [
        { icon: FileText, label: 'Résumé du jour', query: 'Résumé des admissions du jour' },
        { icon: AlertTriangle, label: 'Alertes', query: 'Alertes patients critiques' },
        { icon: Stethoscope, label: 'Consultations', query: 'Consultations prévues' },
    ];

    const handleQuickAction = async (query: string) => {
        setIsLoading(true);
        setInput(query);

        // Simulate AI response
        await new Promise(resolve => setTimeout(resolve, 1000));

        const responses: Record<string, string> = {
            'Résumé des admissions du jour': `📊 Résumé du jour:\n• ${patients.filter(p => p.status === 'admitted').length} patients hospitalisés\n• ${patients.length} patients au total\n• Taux d'occupation: 75%`,
            'Alertes patients critiques': `⚠️ Alertes:\n• 2 patients nécessitent attention\n• 1 allergie signalée\n• 0 urgence critique`,
            'Consultations prévues': `📅 Consultations:\n• 8 RDV aujourd'hui\n• 3 suivis post-op\n• 2 nouvelles admissions prévues`,
        };

        setResponse(responses[query] || 'Je suis prêt à vous aider. Posez votre question.');
        setIsLoading(false);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));
        setResponse(`Analyse en cours pour: "${input}"\n\nJe peux vous aider avec:\n• Résumés patients\n• Alertes médicales\n• Statistiques du service`);
        setIsLoading(false);
        setInput('');
    };

    return (
        <Card className="glass-card col-span-1 md:col-span-2 lg:col-span-1 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-cyan-500/10 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/20">
                        <Brain className="h-4 w-4 text-primary" />
                    </div>
                    Assistant IA Médical
                    <Badge variant="outline" className="ml-auto text-[10px] border-cyan-500/50 text-cyan-600">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Beta
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, i) => (
                        <Button
                            key={i}
                            size="sm"
                            variant="outline"
                            className="text-xs gap-1.5 h-7"
                            onClick={() => handleQuickAction(action.query)}
                            disabled={isLoading}
                        >
                            <action.icon className="h-3 w-3" />
                            {action.label}
                        </Button>
                    ))}
                </div>

                {/* Response Area */}
                {(response || isLoading) && (
                    <div className="p-3 rounded-lg bg-muted/50 border border-border/50 min-h-[80px]">
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Analyse en cours...</span>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Bot className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <p className="text-sm whitespace-pre-wrap">{response}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Input */}
                <form
                    className="flex gap-2"
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                >
                    <Input
                        placeholder="Posez une question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        className="flex-1 h-9 text-sm"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        disabled={!input.trim() || isLoading}
                        className="h-9 w-9 p-0"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default AIAssistantWidget;
