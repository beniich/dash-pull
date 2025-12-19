import { LayoutDashboard, Users, UserPlus, CalendarDays, BedDouble, Stethoscope, Receipt, BarChart3, Settings, ShieldCheck, Activity, TrendingUp, MessageSquare, ClipboardList } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useBrandingStore } from "@/stores/useBrandingStore";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

// Clés de navigation avec leurs clés de traduction
const navigationItems = [
  { titleKey: "nav.dashboard", url: "/dashboard", icon: LayoutDashboard },
  { titleKey: "nav.patients", url: "/patients", icon: Users },
  { titleKey: "nav.agenda", url: "/schedule", icon: CalendarDays },
  { titleKey: "nav.secretary", url: "/secretary", icon: ClipboardList },
  { titleKey: "nav.staff", url: "/staff", icon: Users },
  { titleKey: "nav.resources", url: "/resources/map", icon: BedDouble },
  { titleKey: "nav.billing", url: "/finance/invoices", icon: Receipt },
  { titleKey: "nav.messages", url: "/messages", icon: MessageSquare },
  { titleKey: "nav.reports", url: "/reports", icon: BarChart3 },
  { titleKey: "nav.security", url: "/security", icon: ShieldCheck },
  { titleKey: "nav.settings", url: "/settings", icon: Settings },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { appName, logoUrl, iconUrl, footerText } = useBrandingStore();
  const { t } = useTranslation();

  const isActive = (path: string) => currentPath === path;
  const currentYear = new Date().getFullYear();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border flex flex-col">
      <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
        {state === "expanded" && (
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
            ) : iconUrl ? (
              <img src={iconUrl} alt="Icon" className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
            )}
            <span className="text-lg font-semibold text-sidebar-foreground">{appName}</span>
          </div>
        )}
        <SidebarTrigger className="text-sidebar-foreground" />
      </div>

      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {state === "expanded" && <span>{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Pied de page avec copyright et sélecteur de langue */}
      <SidebarFooter className="border-t border-sidebar-border p-4 space-y-3">
        {state === "expanded" && (
          <div className="flex justify-center">
            <LanguageSelector variant="outline" size="sm" showLabel />
          </div>
        )}
        {state === "expanded" ? (
          <div className="text-center text-xs text-sidebar-foreground/50 space-y-1">
            <p className="font-medium">{footerText}</p>
            <p>© {currentYear} - {t('common.allRightsReserved')}</p>
          </div>
        ) : (
          <div className="text-center text-[10px] text-sidebar-foreground/50">
            <p>©{currentYear}</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
