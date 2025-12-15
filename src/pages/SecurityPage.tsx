
import { DashboardLayout } from "@/components/DashboardLayout";
import { MultiTenantHeader } from "@/components/MultiTenantHeader";
import { AuditLogViewer } from "@/components/audit/AuditLogViewer";
import { SecurityOverview } from "@/components/audit/SecurityOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert } from "lucide-react";

const SecurityPage = () => {
    return (
        <DashboardLayout>
            <div className="flex flex-col min-h-screen bg-background/50">
                <MultiTenantHeader />

                <div className="p-6 md:p-8 space-y-8 flex-1 max-w-[1600px] mx-auto w-full">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                <ShieldAlert className="h-8 w-8 text-primary" />
                                Centre de Sécurité
                            </h1>
                            <p className="text-muted-foreground">Surveillance en temps réel, audits et conformité RGPD.</p>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="bg-background/95 backdrop-blur-sm border border-border/50">
                            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                            <TabsTrigger value="logs">Journal d'Audit</TabsTrigger>
                            <TabsTrigger value="access">Gestion des Accès</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6 animate-fade-in">
                            <SecurityOverview />
                        </TabsContent>

                        <TabsContent value="logs" className="space-y-6 animate-fade-in">
                            <AuditLogViewer />
                        </TabsContent>

                        <TabsContent value="access" className="space-y-6 animate-fade-in">
                            <div className="p-12 border border-dashed rounded-xl flex items-center justify-center text-muted-foreground">
                                Module de gestion des rôles (RBAC) en cours de développement...
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SecurityPage;
