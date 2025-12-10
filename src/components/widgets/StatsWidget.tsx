import { useUserStore } from "@/store/useUserStore";
import { Brain, Activity, Workflow, Box } from "lucide-react";

export const StatsWidget = () => {
  const { stats } = useUserStore();

  const items = [
    { icon: Brain, label: "Requêtes IA", value: stats?.ai_queries ?? 0, color: "text-amber-500" },
    { icon: Activity, label: "Incidents", value: stats?.total_incidents ?? 0, color: "text-orange-500" },
    { icon: Workflow, label: "Workflows", value: stats?.workflows_count ?? 0, color: "text-green-500" },
    { icon: Box, label: "Digital Twins", value: stats?.digital_twins_count ?? 0, color: "text-purple-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-3 p-3 bg-background shadow-neu-inset rounded-xl">
          <item.icon className={`h-5 w-5 ${item.color}`} />
          <div>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-lg font-bold">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
