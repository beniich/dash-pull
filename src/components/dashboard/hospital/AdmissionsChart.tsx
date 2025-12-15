import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarDays } from "lucide-react";

const data = [
    { day: "Lun", admissions: 12, sorties: 8 },
    { day: "Mar", admissions: 15, sorties: 10 },
    { day: "Mer", admissions: 18, sorties: 12 },
    { day: "Jeu", admissions: 14, sorties: 15 },
    { day: "Ven", admissions: 20, sorties: 18 },
    { day: "Sam", admissions: 8, sorties: 5 },
    { day: "Dim", admissions: 5, sorties: 3 },
];

export const AdmissionsChart = () => {
    return (
        <Card className="glass-card col-span-12 lg:col-span-8 flex flex-col h-[350px]">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    Admissions & Sorties (7 jours)
                </CardTitle>
                <CardDescription>
                    Tendance des flux patients. <span className="font-semibold text-green-600">+12%</span> cette semaine.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 w-full h-full min-h-0 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSorties" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                            dy={10}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--popover))",
                                borderColor: "hsl(var(--border))",
                                borderRadius: "var(--radius)",
                                color: "hsl(var(--popover-foreground))"
                            }}
                            itemStyle={{ color: "hsl(var(--foreground))" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="admissions"
                            stroke="hsl(var(--primary))"
                            fillOpacity={1}
                            fill="url(#colorAdmissions)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="sorties"
                            stroke="hsl(var(--success))"
                            fillOpacity={1}
                            fill="url(#colorSorties)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
