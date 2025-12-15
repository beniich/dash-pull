
import { mockTransactions } from "@/lib/mockData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Lock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export const TransactionHistory = () => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'deposit': return <ArrowDownLeft className="h-4 w-4 text-emerald-500" />;
            case 'payment': return <ArrowDownLeft className="h-4 w-4 text-emerald-500" />;
            case 'withdrawal': return <ArrowUpRight className="h-4 w-4 text-foreground" />;
            case 'escrow_lock': return <Lock className="h-4 w-4 text-amber-500" />;
            case 'escrow_release': return <RefreshCw className="h-4 w-4 text-blue-500" />;
            default: return <ArrowUpRight className="h-4 w-4" />;
        }
    };

    return (
        <Card className="glass-card border-none shadow-glass">
            <CardHeader>
                <CardTitle className="text-lg">Historique des Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead>Type</TableHead>
                            <TableHead>Contrepartie</TableHead>
                            <TableHead>Référence</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Montant</TableHead>
                            <TableHead className="text-right">Statut</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockTransactions.map((tx) => (
                            <TableRow key={tx.id} className="hover:bg-muted/30 border-border/50">
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-full bg-background border border-border">
                                            {getIcon(tx.type)}
                                        </div>
                                        <span className="capitalize text-sm font-medium">{tx.type.replace('_', ' ')}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-muted-foreground">{tx.counterparty}</TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">{tx.reference}</TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {new Date(tx.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className={cn(
                                    "text-right font-mono font-medium",
                                    tx.amount > 0 ? "text-emerald-600" : "text-foreground"
                                )}>
                                    {tx.amount > 0 ? '+' : ''}{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: tx.currency }).format(tx.amount)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="outline" className={cn(
                                        "capitalize",
                                        tx.status === 'completed' && "border-emerald-500/30 text-emerald-600 bg-emerald-500/5",
                                        tx.status === 'pending' && "border-amber-500/30 text-amber-600 bg-amber-500/5",
                                    )}>
                                        {tx.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
