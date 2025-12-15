
import { mockDeals } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MoveRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const ProjectList = () => {
    // Sort deals by value or urgency (mock logic)
    const activeProjects = mockDeals.slice(0, 5);

    return (
        <Card className="glass-card h-full border-none shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Projets Actifs
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                    {mockDeals.length} TOTAL
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activeProjects.map((project) => (
                        <div
                            key={project.id}
                            className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-black/5 dark:hover:border-white/10"
                        >
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-foreground/90 group-hover:text-primary transition-colors">
                                    {project.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="capitalize">{project.stage}</span>
                                    <span>•</span>
                                    <span className="font-mono">
                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(project.value)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary/80"
                                        style={{ width: `${project.probability || 0}%` }}
                                    />
                                </div>
                                <Link to={`/deals`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoveRight className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
