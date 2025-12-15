import { DashboardLayout } from "@/components/DashboardLayout";
import { HospitalStats } from "@/components/dashboard/hospital/HospitalStats";
import { BedOccupancyWidget } from "@/components/dashboard/hospital/BedOccupancyWidget";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { MessagePreview } from "@/components/dashboard/MessagePreview";
import { AdmissionsChart } from "@/components/dashboard/hospital/AdmissionsChart";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cockpit Médical</h1>
            <p className="text-muted-foreground">Vue d'ensemble de l'activité hospitalière</p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4" />
              Nouvelle Admission
            </Button>
          </div>
        </div>

        {/* Top Stats */}
        <HospitalStats />

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Admissions (Chart) & Beds */}
          <AdmissionsChart />
          <BedOccupancyWidget />
        </div>

        {/* Secondary Grid: Messages & Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MessagePreview />
          <RecentDocuments />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
