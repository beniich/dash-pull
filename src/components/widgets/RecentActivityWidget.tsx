import { useUserStore } from "@/store/useUserStore";
import { Clock, CheckCircle, AlertCircle, Info } from "lucide-react";

export const RecentActivityWidget = () => {
  const { stats } = useUserStore();

  const activities = [
    {
      icon: CheckCircle,
      title: "Espace personnel actif",
      description: "Données isolées et sécurisées",
      color: "text-green-500",
      time: "Maintenant",
    },
    {
      icon: Info,
      title: `${stats?.ai_queries ?? 0} requêtes IA`,
      description: "Historique personnel conservé",
      color: "text-amber-500",
      time: "Aujourd'hui",
    },
    {
      icon: AlertCircle,
      title: `${stats?.total_incidents ?? 0} incidents traités`,
      description: "Système de monitoring actif",
      color: "text-orange-500",
      time: "Cette semaine",
    },
  ];

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-3 bg-background shadow-neu-inset rounded-xl"
        >
          <activity.icon className={`h-5 w-5 mt-0.5 ${activity.color}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{activity.title}</p>
            <p className="text-xs text-muted-foreground">{activity.description}</p>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
        </div>
      ))}
    </div>
  );
};
