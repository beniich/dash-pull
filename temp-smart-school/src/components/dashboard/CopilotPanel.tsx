import { useState } from "react";
import { X, Send, Bot, Sparkles, FileText, Users, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePaneContext } from "./OutlookLayout";

const quickActions = [
  { icon: Users, label: "Résumer la classe 4B", action: "summarize_class" },
  { icon: FileText, label: "Générer un exercice (Maths)", action: "generate_exercise" },
  { icon: Clock, label: "Analyser absences semaine", action: "analyze_absences" },
  { icon: BarChart3, label: "Rédiger bulletin", action: "write_report" },
];

const CopilotPanel = () => {
  const { isCopilotOpen, setIsCopilotOpen, selectedItem } = usePaneContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", content: message }]);
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Je suis l'assistant IA de SchoolGenius. Cette fonctionnalité sera bientôt disponible avec Lovable Cloud !" 
      }]);
    }, 500);
    setMessage("");
  };

  return (
    <div
      className={cn(
        "h-full bg-card border-l border-border flex flex-col transition-all duration-300 overflow-hidden",
        isCopilotOpen ? "w-80" : "w-0"
      )}
    >
      {isCopilotOpen && (
        <>
          {/* Header */}
          <div className="h-12 px-4 flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">Copilot IA</span>
              <Sparkles className="h-3 w-3 text-accent" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsCopilotOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Context Banner */}
          {selectedItem && (
            <div className="px-4 py-2 bg-muted/50 border-b border-border">
              <p className="text-xs text-muted-foreground">Contexte actif :</p>
              <p className="text-sm font-medium truncate">
                {selectedItem.name || selectedItem.firstName + " " + selectedItem.lastName}
              </p>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Que voulez-vous faire ?
                </p>
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.action}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted text-left transition-colors"
                      onClick={() => {
                        setMessages([
                          { role: "user", content: action.label },
                          { role: "assistant", content: "Je travaille dessus... Cette fonctionnalité sera bientôt disponible avec Lovable Cloud !" }
                        ]);
                      }}
                    >
                      <action.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-3 rounded-lg text-sm",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground ml-4"
                        : "bg-muted mr-4"
                    )}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Demandez à l'IA..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="text-sm"
              />
              <Button size="icon" onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CopilotPanel;
