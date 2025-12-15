import { ReactNode, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { demoUser, demoProfile, demoDashboard, demoStats } from "@/lib/mockData";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { setUser, setSession, setLoading, setProfile, setDashboard, setStats } = useUserStore();

    useEffect(() => {
        // Simulate async loading for realism
        const timer = setTimeout(() => {
            console.log("MockAuthProvider: Logging in as Demo User");

            // Mock Session
            setSession({
                user: demoUser,
                access_token: "mock-token",
                refresh_token: "mock-refresh-token",
                expires_at: 9999999999,
                expires_in: 999999,
                token_type: "bearer"
            });

            // Mock Data
            setUser(demoUser);
            setProfile(demoProfile);
            setDashboard(demoDashboard);
            setStats(demoStats);

            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [setUser, setSession, setLoading, setProfile, setDashboard, setStats]);

    return <>{children}</>;
};
