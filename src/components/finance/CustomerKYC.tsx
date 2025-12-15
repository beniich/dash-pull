
import { mockUserIdentity } from "@/lib/mockData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Calendar, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CustomerKYC = () => {
    const { kyc_level, kyc_documents_status, last_verification, legal_name } = mockUserIdentity;

    return (
        <Card className="glass-card border-none shadow-glass h-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Identité & Conformité
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Niveau Actuel</p>
                        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 capitalize flex items-center gap-2">
                            {kyc_level}
                            <ShieldCheck className="h-4 w-4" />
                        </p>
                    </div>
                    <Badge className="bg-emerald-600 hover:bg-emerald-700">Conforme</Badge>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Entité Légale</span>
                        <span className="font-medium">{legal_name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Dernière Vérification</span>
                        <span className="font-mono">{new Date(last_verification).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground">Documents</h4>
                    <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 text-sm">
                            <FileCheck className="h-4 w-4 text-emerald-500" />
                            <span>Pièce d'identité</span>
                        </div>
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 uppercase text-[10px]">
                            {kyc_documents_status.id_card}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 text-sm">
                            <FileCheck className="h-4 w-4 text-emerald-500" />
                            <span>Justificatif Domicile</span>
                        </div>
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 uppercase text-[10px]">
                            {kyc_documents_status.proof_of_address}
                        </Badge>
                    </div>
                </div>

                <Button variant="outline" className="w-full mt-2">
                    Mettre à jour KYC
                </Button>
            </CardContent>
        </Card>
    );
};
