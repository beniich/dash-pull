import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { useDynamicBranding } from "@/hooks/useDynamicBranding";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  // Active le branding dynamique (titre page, favicon)
  useDynamicBranding();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with Notifications */}
          <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-end gap-2 px-6 sticky top-0 z-40">
            <LanguageSelector />
            <ThemeToggle />
            <NotificationCenter />
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
