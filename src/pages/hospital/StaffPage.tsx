import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";

const StaffPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Gestion du Personnel
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Médecins, Infirmiers et Personnel Administratif.
                    </p>
                </div>

                <Card className="glass-card min-h-[500px] flex items-center justify-center border-dashed">
                    <CardContent className="text-center space-y-4">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                            <Stethoscope className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Annuaire Staff</h3>
                            <p className="text-muted-foreground">La gestion des profils et des gardes sera bientôt disponible ici.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default StaffPage;
