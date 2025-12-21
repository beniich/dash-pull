import { useState } from "react";
import CenterPane from "@/components/dashboard/CenterPane";
import DetailPane from "@/components/dashboard/DetailPane";
import ListItem from "@/components/dashboard/ListItem";
import { usePaneContext } from "@/components/dashboard/OutlookLayout";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const sampleMessages = [
  { id: "1", from: "Direction", subject: "Réunion parents-professeurs", date: "Aujourd'hui", read: false, type: "announcement" },
  { id: "2", from: "Mme Dupont", subject: "Résultats du contrôle de maths", date: "Hier", read: true, type: "message" },
  { id: "3", from: "Parents de Ahmed K.", subject: "Justificatif d'absence", date: "18/12", read: true, type: "message" },
  { id: "4", from: "Administration", subject: "Modification emploi du temps", date: "17/12", read: true, type: "announcement" },
  { id: "5", from: "M. Martin", subject: "Sortie scolaire 3B", date: "16/12", read: true, type: "message" },
];

const CommunicationModule = () => {
  const [selectedMessage, setSelectedMessage] = useState<typeof sampleMessages[0] | null>(null);
  const { setSelectedItem } = usePaneContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [reply, setReply] = useState("");

  const filteredMessages = sampleMessages.filter(m =>
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMessage = (msg: typeof sampleMessages[0]) => {
    setSelectedMessage(msg);
    setSelectedItem(msg);
  };

  return (
    <>
      <CenterPane
        title="Messages"
        searchPlaceholder="Rechercher un message..."
        onSearch={setSearchQuery}
        onAdd={() => {}}
        addLabel="Nouveau"
      >
        {filteredMessages.map((msg) => (
          <ListItem
            key={msg.id}
            title={msg.subject}
            subtitle={msg.from}
            icon={<MessageSquare className={`h-4 w-4 ${msg.read ? 'text-muted-foreground' : 'text-primary'}`} />}
            badge={!msg.read ? "Nouveau" : undefined}
            badgeVariant="default"
            isSelected={selectedMessage?.id === msg.id}
            onClick={() => handleSelectMessage(msg)}
            rightContent={
              <span className="text-xs text-muted-foreground">{msg.date}</span>
            }
          />
        ))}
      </CenterPane>

      {selectedMessage ? (
        <DetailPane
          title={selectedMessage.subject}
          subtitle={`De : ${selectedMessage.from} • ${selectedMessage.date}`}
          onClose={() => {
            setSelectedMessage(null);
            setSelectedItem(null);
          }}
        >
          <div className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <p>
                Bonjour,
              </p>
              <p>
                Ceci est un exemple de message. Le contenu complet du message sera affiché ici
                avec toutes les informations pertinentes.
              </p>
              <p>
                Cordialement,<br />
                {selectedMessage.from}
              </p>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium mb-3">Répondre</h4>
              <Textarea
                placeholder="Tapez votre réponse..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="mb-3"
                rows={4}
              />
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        </DetailPane>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">Sélectionnez un message</p>
            <p className="text-sm">pour le lire</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CommunicationModule;
