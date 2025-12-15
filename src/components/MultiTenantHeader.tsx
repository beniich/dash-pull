import { useUserStore } from "@/store/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Activity, Brain, Workflow, Box, LogOut, Settings, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

export const MultiTenantHeader = () => {
  const { user, profile, stats } = useUserStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  if (!user) return null;

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Utilisateur";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="bg-background border-b border-border shadow-neu py-3 px-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="font-bold text-lg text-foreground">
          Bienvenue, {displayName}
        </div>
        {profile?.company && (
          <Badge variant="secondary" className="hidden md:inline-flex">
            {profile.company}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Stats rapides */}
        <div className="hidden lg:flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-primary" />
            <span>{stats?.ai_queries ?? 0} requêtes IA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-orange-500" />
            <span>{stats?.total_incidents ?? 0} incidents</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Workflow className="h-4 w-4 text-green-500" />
            <span>{stats?.workflows_count ?? 0} workflows</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Box className="h-4 w-4 text-purple-500" />
            <span>{stats?.digital_twins_count ?? 0} twins</span>
          </div>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Mon profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
