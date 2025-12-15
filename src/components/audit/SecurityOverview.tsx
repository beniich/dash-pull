
import { mockSecurityAlerts } from "@/lib/mockData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ShieldCheck, Lock, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SecurityOverview = () => {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass-card border-none shadow-glass bg-emerald-500/5 border-l-4 border-l-emerald-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                            Santé Système
                        </CardTitle>
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">98%</div>
                        <p className="text-xs text-emerald-600/80">Tous les systèmes opérationnels</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none shadow-glass bg-blue-500/5 border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
                            Chiffrement
                        </CardTitle>
                        <Lock className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">AES-256</div>
                        <p className="text-xs text-blue-600/80">Données sensibles protégées</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none shadow-glass bg-amber-500/5 border-l-4 border-l-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">
                            Alertes Actives
                        </CardTitle>
                        <Activity className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                            {mockSecurityAlerts.filter(a => a.status === 'active').length}
                        </div>
                        <p className="text-xs text-amber-600/80">Nécessite votre attention</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Alertes de Sécurité Récentes
                </h3>
                {mockSecurityAlerts.map(alert => (
                    <Alert key={alert.id} variant={alert.severity === 'critical' ? "destructive" : "default"} className="glass-card bg-background/50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="capitalize flex items-center gap-2">
                            {alert.severity} Priority
                            <span className="text-xs font-normal text-muted-foreground ml-auto font-mono">
                                {new Date(alert.timestamp).toLocaleString()}
                            </span>
                        </AlertTitle>
                        <AlertDescription className="text-muted-foreground">
                            {alert.message}
                        </AlertDescription>
                    </Alert>
                ))}
            </div>
        </div>
    );
};
