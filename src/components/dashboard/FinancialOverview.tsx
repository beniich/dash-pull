
import { mockInvoices } from "@/lib/mockData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Wallet, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const FinancialOverview = () => {
    // Calculate totals
    const totalPending = mockInvoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const totalOverdue = mockInvoices
        .filter(inv => inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.amount, 0);

    return (
        <Card className="glass-card mb-6 border-none shadow-glass transition-all hover:shadow-glass-lg relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    Finance
                </CardTitle>
                <div className="flex gap-2">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        +12.5% vs M-1
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">En attente</p>
                        <p className="text-2xl font-bold mt-1 text-foreground font-mono">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalPending)}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/20">
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs text-red-600 dark:text-red-400 font-medium uppercase tracking-wider">Retard</p>
                            {totalOverdue > 0 && <AlertCircle className="h-3 w-3 text-red-500 animate-pulse" />}
                        </div>
                        <p className="text-2xl font-bold text-red-700 dark:text-red-400 font-mono">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalOverdue)}
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1">Dernières Factures</h4>
                    {mockInvoices.slice(0, 3).map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-2 hover:bg-white/50 dark:hover:bg-white/5 rounded-md transition-colors cursor-pointer group/item">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{invoice.client_name}</span>
                                <span className="text-xs text-muted-foreground font-mono">{invoice.ref_number}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold font-mono">
                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(invoice.amount)}
                                </span>
                                <Badge variant="secondary" className={cn(
                                    "text-[10px] h-5 px-1.5",
                                    invoice.status === 'paid' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                                    invoice.status === 'pending' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                                    invoice.status === 'overdue' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                                )}>
                                    {invoice.status}
                                </Badge>
                                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
