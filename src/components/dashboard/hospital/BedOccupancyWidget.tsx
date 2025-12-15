import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BedDouble, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { mockHospitalStats } from "@/lib/mockData";

export const BedOccupancyWidget = () => {
    const stats = mockHospitalStats;

    return (
        <Card className="glass-card col-span-12 md:col-span-6 lg:col-span-4">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BedDouble className="h-5 w-5 text-primary" />
                            Occupation des Lits
                        </CardTitle>
                        <CardDescription>Capacité globale de l'hôpital</CardDescription>
                    </div>
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-semibold">
                        {stats.occupancy_rate}%
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Main Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{stats.occupied_beds} occupés</span>
                            <span className="text-muted-foreground">{stats.available_beds} libres</span>
                        </div>
                        <Progress value={stats.occupancy_rate} className="h-3" />
                    </div>

                    {/* Detailed Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-red-500/10 rounded-lg space-y-1">
                            <div className="flex items-center gap-2 text-red-500">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-xs font-medium">Urgences</span>
                            </div>
                            <p className="text-2xl font-bold text-red-600">85%</p>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg space-y-1">
                            <div className="flex items-center gap-2 text-green-500">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-xs font-medium">Pédiatrie</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">40%</p>
                        </div>
                    </div>

                    {/* Wait Time Indicator */}
                    <div className="pt-2 border-t border-border/50">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                Attente moyenne Urgences
                            </div>
                            <span className={`font-mono font-medium ${stats.emergency_wait_time > 60 ? 'text-red-500' : 'text-orange-500'}`}>
                                {stats.emergency_wait_time} min
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
