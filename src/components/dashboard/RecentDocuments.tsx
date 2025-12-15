
import { mockDocuments } from "@/lib/mockData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RecentDocuments = () => {
    return (
        <Card className="glass-card h-full border-none shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Documents
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Voir Tout
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {mockDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium leading-none">{doc.title}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{doc.size}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {doc.last_modified}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Download className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
