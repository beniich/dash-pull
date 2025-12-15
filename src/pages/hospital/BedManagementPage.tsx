import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { BedDouble } from "lucide-react";

const BedManagementPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Services & Lits
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Vue temps réel de l'occupation et nettoyage des chambres.
                    </p>
                </div>

                <Card className="glass-card min-h-[500px] flex items-center justify-center border-dashed">
                    <CardContent className="text-center space-y-4">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                            <BedDouble className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Carte des Services</h3>
                            <p className="text-muted-foreground">La visualisation interactive des lits sera bientôt disponible ici.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default BedManagementPage;
