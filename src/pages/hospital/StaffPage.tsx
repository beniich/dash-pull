import { DashboardLayout } from "@/components/DashboardLayout";
import { StaffCard } from "@/components/hospital/StaffCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, UserPlus, Users, CalendarClock } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffSchedule } from "@/components/hospital/StaffSchedule";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { StaffForm } from "@/components/hospital/StaffForm";
import { useHospitalStore } from "@/stores/useHospitalStore";

// ... imports

// Remove local interface Staff and mockStaff
// ...

const StaffPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<'all' | 'on_duty'>('all');

    // Connect to store
    const staff = useHospitalStore((state) => state.staff);

    const filteredStaff = staff.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member.specialty?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || member.status === 'on_duty';
        return matchesSearch && matchesFilter;
    });

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in pb-12">
                <Tabs defaultValue="directory" className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Gestion du Personnel
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {staff.length} collaborateurs actifs • {staff.filter(s => s.status === 'on_duty').length} en service
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <TabsList>
                                <TabsTrigger value="directory" className="gap-2"><Users className="h-4 w-4" /> Annuaire</TabsTrigger>
                                <TabsTrigger value="planning" className="gap-2"><CalendarClock className="h-4 w-4" /> Planning</TabsTrigger>
                            </TabsList>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="gap-2 shadow-lg shadow-primary/20">
                                        <UserPlus className="h-4 w-4" />
                                        Nouveau Membre
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <StaffForm onSuccess={() => { document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Escape' })); }} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <TabsContent value="directory" className="space-y-6 animate-fade-in">
                        {/* Search Bar */}
                        <div className="flex gap-4 items-center">
                            <div className="relative max-w-md flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher par nom ou spécialité..."
                                    className="pl-10 bg-background/50 border-input/50 focus:bg-background"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="gap-2" onClick={() => setFilter(filter === 'all' ? 'on_duty' : 'all')}>
                                <Filter className="h-4 w-4" />
                                {filter === 'all' ? 'Voir uniquement "En Service"' : 'Voir Tout'}
                            </Button>
                        </div>

                        {/* Staff Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredStaff.map((staff) => (
                                <StaffCard key={staff.id} data={staff} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="planning" className="animate-fade-in">
                        <StaffSchedule />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default StaffPage;
