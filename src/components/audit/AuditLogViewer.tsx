
import { mockAuditLogs } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, CheckCircle2, XCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export const AuditLogViewer = () => {
    return (
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Journal d'Audit
                </CardTitle>
                <Badge variant="outline" className="bg-primary/5 border-primary/20">
                    Dernières 24 heures
                </Badge>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Acteur</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Ressource</TableHead>
                            <TableHead>IP</TableHead>
                            <TableHead>Statut</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockAuditLogs.map((log) => (
                            <TableRow key={log.id} className="group hover:bg-muted/50">
                                <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                                    {new Date(log.timestamp).toLocaleString()}
                                </TableCell>
                                <TableCell className="font-medium text-sm">
                                    {log.actor}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="font-mono text-[10px] tracking-wider uppercase">
                                        {log.action}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm font-light text-muted-foreground">
                                    {log.resource}
                                </TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                    {log.ip_address}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {log.status === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                        {log.status === 'failure' && <XCircle className="h-4 w-4 text-rose-500" />}
                                        {log.status === 'warning' && <ShieldAlert className="h-4 w-4 text-amber-500" />}
                                        <span className={cn(
                                            "capitalize text-xs font-medium",
                                            log.status === 'success' && "text-emerald-600",
                                            log.status === 'failure' && "text-rose-600",
                                            log.status === 'warning' && "text-amber-600",
                                        )}>
                                            {log.status}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
