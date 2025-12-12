import { ReactNode, useEffect, useCallback } from "react";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/integrations/supabase/client";
import type { UserDashboard, UserStats } from "@/lib/mockData";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, setSession, setLoading, setProfile, setDashboard, setStats, clearUserData } = useUserStore();

  const loadUserData = useCallback(async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileData) setProfile(profileData);

      // Fetch or create dashboard
      let { data: dashboardData } = await supabase
        .from("user_dashboards")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!dashboardData) {
        const { data: newDashboard } = await supabase
          .from("user_dashboards")
          .insert({ user_id: userId })
          .select()
          .single();
        dashboardData = newDashboard;
      }

      if (dashboardData) setDashboard(dashboardData as UserDashboard);

      // Fetch or create stats
      let { data: statsData } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!statsData) {
        const { data: newStats } = await supabase
          .from("user_stats")
          .insert({ user_id: userId })
          .select()
          .single();
        statsData = newStats;
      }

      if (statsData) setStats(statsData as UserStats);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  }, [setProfile, setDashboard, setStats, setLoading]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Defer data loading with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            loadUserData(session.user.id);
          }, 0);
        } else {
          clearUserData();
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [clearUserData, loadUserData, setLoading, setSession, setUser]);

  return <>{children}</>;
};
