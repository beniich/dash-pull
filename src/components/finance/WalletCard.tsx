
import { mockFinancialProfile } from "@/lib/mockData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wallet, ShieldCheck, ArrowUpRight, ArrowDownLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WalletCard = () => {
    const { wallet_balance, escrow_balance, currency, iban } = mockFinancialProfile;

    const formatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency });

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Main Wallet */}
            <Card className="glass-card border-none shadow-glass relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Solde Disponible
                    </CardTitle>
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold font-mono tracking-tight text-foreground">
                        {formatter.format(wallet_balance)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 font-mono">
                        {iban}
                    </p>
                    <div className="flex gap-2 mt-6">
                        <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            <ArrowUpRight className="h-4 w-4 mr-1" /> Virement
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                            <ArrowDownLeft className="h-4 w-4 mr-1" /> Ajouter
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Escrow Wallet */}
            <Card className="glass-card border-none shadow-glass bg-muted/30">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Lock className="h-4 w-4 text-amber-500" />
                        Fonds Bloqués (Escrow)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold font-mono tracking-tight text-foreground/80">
                        {formatter.format(escrow_balance)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Sécurisé jusqu'à la fin de la mission
                    </p>
                    <div className="mt-6 pt-2 border-t border-border/50">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Prochains déblocages</span>
                            <span className="font-mono font-medium">15/04/2024</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
