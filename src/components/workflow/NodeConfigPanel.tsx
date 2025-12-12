import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { useEffect, useState } from "react";

interface NodeData {
    label: string;
    icon: string;
    description?: string;
    config?: {
        // Email
        to?: string;
        subject?: string;
        body?: string;
        // API
        url?: string;
        method?: string;
        headers?: string;
        // Redirect / Iframe
        targetUrl?: string;
        iframeSrc?: string;
        width?: string;
        height?: string;
        // Sheets
        sheetId?: string;
        range?: string;
        action?: string;
        // Slack
        webhookUrl?: string;
        channel?: string;
        message?: string;
        // Stripe
        secretKey?: string;
        resource?: string;
        operation?: string;
        // Condition
        variable?: string;
        operator?: string;
        value?: string;
        // Delay
        duration?: string;
        unit?: string;
    };
}

interface NodeConfigPanelProps {
    selectedNode: {
        id: string;
        data: NodeData;
    } | null;
    onClose: () => void;
    onUpdate: (id: string, newData: NodeData) => void;
}

export const NodeConfigPanel = ({ selectedNode, onClose, onUpdate }: NodeConfigPanelProps) => {
    const [formData, setFormData] = useState<NodeData["config"]>({});
    const [label, setLabel] = useState("");

    useEffect(() => {
        if (selectedNode) {
            setFormData(selectedNode.data.config || {});
            setLabel(selectedNode.data.label);
        }
    }, [selectedNode]);

    if (!selectedNode) return null;

    const handleSave = () => {
        onUpdate(selectedNode.id, {
            ...selectedNode.data,
            label,
            config: formData,
            description: getDescription(selectedNode.data.icon, formData)
        });
    };

    const getDescription = (type: string, config: any) => {
        switch (type) {
            case 'email': return `To: ${config?.to || '?'}`;
            case 'api': return `${config?.method || 'GET'} ${config?.url || '...'}`;
            case 'redirect': return `Go to: ${config?.targetUrl || '...'}`;
            case 'iframe': return `Embed: ${config?.iframeSrc || '...'}`;
            case 'sheets': return `Sheet: ${config?.sheetId?.slice(0, 8) || '...'}...`;
            case 'slack': return `Channel: ${config?.channel || '#'}`;
            case 'stripe': return `${config?.resource} / ${config?.operation}`;
            case 'condition': return `If ${config?.variable} ${config?.operator} ${config?.value}`;
            case 'delay': return `Wait ${config?.duration} ${config?.unit}`;
            default: return selectedNode.data.description;
        }
    };

    return (
        <div className="w-80 border-l bg-background h-full p-4 overflow-y-auto shadow-neu-left absolute right-0 top-0 bottom-0 z-50">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Configuration</h3>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label>Nom du noeud</Label>
                    <Input
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    />
                </div>

                {/* Email Fields */}
                {selectedNode.data.icon === 'email' && (
                    <>
                        <div className="space-y-2">
                            <Label>Destinataire</Label>
                            <Input
                                value={formData?.to || ''}
                                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                placeholder="email@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Sujet</Label>
                            <Input
                                value={formData?.subject || ''}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="Sujet de l'email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea
                                value={formData?.body || ''}
                                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                placeholder="Contenu du message..."
                                rows={4}
                            />
                        </div>
                    </>
                )}

                {/* API Fields */}
                {selectedNode.data.icon === 'api' && (
                    <>
                        <div className="space-y-2">
                            <Label>URL Endpoint</Label>
                            <Input
                                value={formData?.url || ''}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://api.example.com/v1/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Méthode</Label>
                            <Select
                                value={formData?.method || 'GET'}
                                onValueChange={(v) => setFormData({ ...formData, method: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GET">GET</SelectItem>
                                    <SelectItem value="POST">POST</SelectItem>
                                    <SelectItem value="PUT">PUT</SelectItem>
                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Headers (JSON)</Label>
                            <Textarea
                                value={formData?.headers || ''}
                                onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
                                placeholder='{ "Authorization": "Bearer..." }'
                                rows={3}
                                className="font-mono text-xs"
                            />
                        </div>
                    </>
                )}

                {/* Sheets Fields */}
                {selectedNode.data.icon === 'sheets' && (
                    <>
                        <div className="space-y-2">
                            <Label>Spreadsheet ID</Label>
                            <Input
                                value={formData?.sheetId || ''}
                                onChange={(e) => setFormData({ ...formData, sheetId: e.target.value })}
                                placeholder="1BxiMVs0XRA5nFMd..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Range ex: Sheet1!A1:B10</Label>
                            <Input
                                value={formData?.range || ''}
                                onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                                placeholder="Feuille 1!A1:B10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Action</Label>
                            <Select
                                value={formData?.action || 'read'}
                                onValueChange={(v) => setFormData({ ...formData, action: v })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="read">Lire</SelectItem>
                                    <SelectItem value="write">Écrire</SelectItem>
                                    <SelectItem value="append">Ajouter</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )}

                {/* Slack Fields */}
                {selectedNode.data.icon === 'slack' && (
                    <>
                        <div className="space-y-2">
                            <Label>Webhook URL</Label>
                            <Input
                                value={formData?.webhookUrl || ''}
                                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                                placeholder="https://hooks.slack.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Channel (Optional)</Label>
                            <Input
                                value={formData?.channel || ''}
                                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                                placeholder="#general"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea
                                value={formData?.message || ''}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Hello World"
                                rows={3}
                            />
                        </div>
                    </>
                )}

                {/* Stripe Fields */}
                {selectedNode.data.icon === 'stripe' && (
                    <>
                        <div className="space-y-2">
                            <Label>Secret Key</Label>
                            <Input
                                type="password"
                                value={formData?.secretKey || ''}
                                onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                                placeholder="sk_test_..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Ressource</Label>
                            <Select
                                value={formData?.resource || 'customer'}
                                onValueChange={(v) => setFormData({ ...formData, resource: v })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="customer">Client (Customer)</SelectItem>
                                    <SelectItem value="charge">Paiement (Charge)</SelectItem>
                                    <SelectItem value="subscription">Abonnement</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Opération</Label>
                            <Select
                                value={formData?.operation || 'create'}
                                onValueChange={(v) => setFormData({ ...formData, operation: v })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="create">Créer</SelectItem>
                                    <SelectItem value="retrieve">Récupérer</SelectItem>
                                    <SelectItem value="update">Mettre à jour</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )}

                {/* Condition Fields */}
                {selectedNode.data.icon === 'condition' && (
                    <>
                        <div className="space-y-2">
                            <Label>Variable</Label>
                            <Input
                                value={formData?.variable || ''}
                                onChange={(e) => setFormData({ ...formData, variable: e.target.value })}
                                placeholder="ex: amount"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Opérateur</Label>
                            <Select
                                value={formData?.operator || 'equals'}
                                onValueChange={(v) => setFormData({ ...formData, operator: v })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="equals">Est égal à</SelectItem>
                                    <SelectItem value="contains">Contient</SelectItem>
                                    <SelectItem value="greater">Supérieur à</SelectItem>
                                    <SelectItem value="less">Inférieur à</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Valeur</Label>
                            <Input
                                value={formData?.value || ''}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                placeholder="1000"
                            />
                        </div>
                    </>
                )}

                {/* Delay Fields */}
                {selectedNode.data.icon === 'delay' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Durée</Label>
                            <Input
                                type="number"
                                value={formData?.duration || '1'}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Unité</Label>
                            <Select
                                value={formData?.unit || 'minutes'}
                                onValueChange={(v) => setFormData({ ...formData, unit: v })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="seconds">Secondes</SelectItem>
                                    <SelectItem value="minutes">Minutes</SelectItem>
                                    <SelectItem value="hours">Heures</SelectItem>
                                    <SelectItem value="days">Jours</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Iframe/Redirect Fields */}
                {(selectedNode.data.icon === 'iframe' || selectedNode.data.icon === 'redirect') && (
                    <div className="space-y-2">
                        <Label>URL Cible</Label>
                        <Input
                            value={selectedNode.data.icon === 'redirect' ? (formData?.targetUrl || '') : (formData?.iframeSrc || '')}
                            onChange={(e) => setFormData({
                                ...formData,
                                [selectedNode.data.icon === 'redirect' ? 'targetUrl' : 'iframeSrc']: e.target.value
                            })}
                            placeholder="https://..."
                        />
                    </div>
                )}

                {selectedNode.data.icon === 'iframe' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Largeur</Label>
                            <Input
                                value={formData?.width || '100%'}
                                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Hauteur</Label>
                            <Input
                                value={formData?.height || '400px'}
                                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                <Button onClick={handleSave} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Appliquer
                </Button>
            </div>
        </div>
    );
};
