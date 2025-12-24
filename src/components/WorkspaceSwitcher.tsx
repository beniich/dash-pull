import * as React from "react"
import { ChevronsUpDown, Plus, Check } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useWorkspaceStore, Workspace } from "@/stores/useWorkspaceStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function WorkspaceSwitcher() {
    const { isMobile } = useSidebar()
    const { workspaces, activeWorkspaceId, setActiveWorkspace } = useWorkspaceStore()

    const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0]

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {activeWorkspace.logo ? (
                                    <img src={activeWorkspace.logo} alt={activeWorkspace.name} className="size-8 rounded-lg object-cover" />
                                ) : (
                                    <span className="font-bold text-sm">{activeWorkspace.name.substring(0, 2).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold text-foreground/90">
                                    {activeWorkspace.name}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">{activeWorkspace.type}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Workspaces
                        </DropdownMenuLabel>
                        {workspaces.map((workspace) => (
                            <DropdownMenuItem
                                key={workspace.id}
                                onClick={() => setActiveWorkspace(workspace.id)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                    {workspace.logo ? (
                                        <img src={workspace.logo} alt={workspace.name} className="size-6 rounded-sm object-cover" />
                                    ) : (
                                        <span className="font-bold text-[10px]">{workspace.name.substring(0, 2).toUpperCase()}</span>
                                    )}
                                </div>
                                {workspace.name}
                                {workspace.id === activeWorkspaceId && <Check className="ml-auto h-4 w-4" />}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2" onClick={() => {/* Future Add Workspace Logic */ }}>
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">Add workspace</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
