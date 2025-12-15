import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Printer, Save, Download, CreditCard } from "lucide-react";

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
}

export const InvoiceEditor = () => {
    const [hospitalInfo] = useState({
        name: "Cloud Hôpital Center",
        address: "123 Avenue de la Santé, 75000 Paris",
        phone: "+33 1 23 45 67 89",
        email: "facturation@cloud-hopital.fr"
    });

    const [patientInfo, setPatientInfo] = useState({
        name: "Jean Dupont",
        id: "PAT-2024-001",
        address: "42 Rue des Fleurs, Lyon",
        insurance: "Mutuelle Santé Plus"
    });

    const [items, setItems] = useState<InvoiceItem[]>([
        { id: '1', description: 'Consultation Spécialiste (Cardiologie)', quantity: 1, unitPrice: 75.00 },
        { id: '2', description: 'Électrocardiogramme (ECG)', quantity: 1, unitPrice: 45.50 },
        { id: '3', description: 'Nuitée Hospitalisation (Chambre Simple)', quantity: 2, unitPrice: 150.00 },
    ]);

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    };

    const addItem = () => {
        setItems([...items, { id: Date.now().toString(), description: "Nouvel Acte", quantity: 1, unitPrice: 0 }]);
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            {/* Invoice Preview / Editor Area */}
            <Card className="flex-1 p-8 bg-white shadow-xl rounded-sm min-h-[800px] text-slate-800 font-sans print:shadow-none">
                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">H</div>
                            <h1 className="text-2xl font-bold text-primary">{hospitalInfo.name}</h1>
                        </div>
                        <div className="text-sm text-slate-500 space-y-1">
                            <p>{hospitalInfo.address}</p>
                            <p>{hospitalInfo.phone}</p>
                            <p>{hospitalInfo.email}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-light text-slate-300 mb-2">FACTURE</h2>
                        <div className="text-sm">
                            <p><span className="font-semibold">N° Facture:</span> FAC-2024-892</p>
                            <p><span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Patient Info */}
                <div className="flex justify-between mb-12 bg-slate-50 p-6 rounded-lg border border-slate-100">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">FACTURÉ À</p>
                        <Input
                            value={patientInfo.name}
                            onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                            className="font-bold text-lg bg-transparent border-none p-0 h-auto focus:ring-0 text-slate-900 placeholder:text-slate-300 mb-1"
                        />
                        <Input
                            value={patientInfo.address}
                            onChange={(e) => setPatientInfo({ ...patientInfo, address: e.target.value })}
                            className="text-sm bg-transparent border-none p-0 h-auto focus:ring-0 text-slate-600"
                        />
                    </div>
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">INFORMATIONS</p>
                        <p className="text-sm"><span className="font-semibold">ID Patient:</span> {patientInfo.id}</p>
                        <div className="flex items-center justify-end gap-2 mt-1">
                            <span className="text-sm font-semibold">Assurance:</span>
                            <Input
                                value={patientInfo.insurance}
                                onChange={(e) => setPatientInfo({ ...patientInfo, insurance: e.target.value })}
                                className="text-sm bg-transparent border-none p-0 h-auto focus:ring-0 text-right w-[150px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <Table className="mb-8">
                    <TableHeader>
                        <TableRow className="border-b-2 border-slate-800 hover:bg-transparent">
                            <TableHead className="text-slate-900 font-bold w-[50%]">DESCRIPTION</TableHead>
                            <TableHead className="text-slate-900 font-bold text-center">QTÉ</TableHead>
                            <TableHead className="text-slate-900 font-bold text-right">PRIX UNIT.</TableHead>
                            <TableHead className="text-slate-900 font-bold text-right">TOTAL</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id} className="hover:bg-slate-50 group">
                                <TableCell>
                                    <Input
                                        value={item.description}
                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                        className="bg-transparent border-none p-0 h-auto focus:ring-0 font-medium"
                                    />
                                </TableCell>
                                <TableCell className="text-center">
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                                        className="bg-transparent border-none p-0 h-auto focus:ring-0 text-center w-full"
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Input
                                        type="number"
                                        value={item.unitPrice}
                                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                                        className="bg-transparent border-none p-0 h-auto focus:ring-0 text-right w-full"
                                    />
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {(item.quantity * item.unitPrice).toFixed(2)} €
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 h-6 w-6 text-red-400 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Button variant="outline" onClick={addItem} className="mb-8 border-dashed text-slate-500 hover:text-primary hover:border-primary">
                    <Plus className="h-4 w-4 mr-2" /> Ajouter une ligne
                </Button>

                <Separator className="mb-8" />

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-[300px] space-y-3">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Sous-total</span>
                            <span>{calculateTotal().toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>TVA (20%)</span>
                            <span>{(calculateTotal() * 0.20).toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600 font-medium">
                            <span>Prise en charge {patientInfo.insurance} (-70%)</span>
                            <span>-{(calculateTotal() * 0.70).toFixed(2)} €</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-xl font-bold text-slate-900 py-2">
                            <span>Reste à payer</span>
                            <span>{((calculateTotal() * 1.20) - (calculateTotal() * 0.70)).toFixed(2)} €</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-xs text-slate-400">
                    <p>Conditions de paiement : 30 jours. Merci de votre confiance.</p>
                </div>
            </Card>

            {/* Sidebar Actions */}
            <div className="w-full lg:w-[300px] flex flex-col gap-4">
                <Card className="p-4 glass-card space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Save className="h-4 w-4" /> Actions
                    </h3>
                    <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                        <Save className="h-4 w-4" /> Enregistrer les modifs
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                        <Printer className="h-4 w-4" /> Imprimer / PDF
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                        <Download className="h-4 w-4" /> Exporter Excel
                    </Button>
                </Card>

                <Card className="p-4 glass-card space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <CreditCard className="h-4 w-4" /> Paiement
                    </h3>
                    <div className="text-sm text-muted-foreground mb-2">
                        Statut actuel: <span className="text-yellow-500 font-medium">En attente</span>
                    </div>
                    <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
                        Encaisser le paiement
                    </Button>
                    <Button variant="ghost" className="w-full text-xs">
                        Envoyer lien de paiement
                    </Button>
                </Card>
            </div>
        </div>
    );
};
