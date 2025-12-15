import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, UserMinus, Activity, Stethoscope, Users } from "lucide-react";
import { mockHospitalStats } from "@/lib/mockData";

export const HospitalStats = () => {
    const stats = mockHospitalStats;

    const kpis = [
        {
            label: "Admissions (24h)",
            value: stats.admissions_today,
            icon: UserPlus,
            color: "text-primary",
            bg: "bg-primary/10",
            trend: "+12%"
        },
        {
            label: "Sorties (24h)",
            value: stats.discharges_today,
            icon: UserMinus,
            color: "text-success",
            bg: "bg-success/10",
            trend: "+5%"
        },
        {
            label: "Médecins présents",
            value: stats.doctors_on_duty,
            icon: Stethoscope,
            color: "text-secondary hover:text-secondary-foreground",
            bg: "bg-secondary/10",
            trend: "Normal"
        },
        {
            label: "Infirmiers présents",
            value: stats.nurses_on_duty,
            icon: Users,
            color: "text-chart-4", // Yellow/Gold from theme
            bg: "bg-chart-4/10",
            trend: "Normal"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((kpi, index) => (
                <Card key={index} className="glass-card hover:translate-y-[-2px] transition-transform">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                            <h3 className="text-2xl font-bold mt-1 text-foreground">{kpi.value}</h3>
                            <span className="text-xs text-green-500 flex items-center mt-1">
                                <Activity className="h-3 w-3 mr-1" />
                                {kpi.trend}
                            </span>
                        </div>
                        <div className={`p-3 rounded-xl ${kpi.bg}`}>
                            <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
