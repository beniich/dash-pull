import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    selectedTags: string[];
    onTagToggle: (tag: string) => void;
    availableTags: string[];
    selectedPriorities: string[];
    onPriorityToggle: (priority: string) => void;
    onClear: () => void;
}

export function TaskFilters({
    search,
    onSearchChange,
    selectedTags,
    onTagToggle,
    availableTags,
    selectedPriorities,
    onPriorityToggle,
    onClear,
}: TaskFiltersProps) {
    const hasFilters = selectedTags.length > 0 || selectedPriorities.length > 0 || search.length > 0;

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl shadow-neu mb-6">
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Rechercher une tâche..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 bg-background"
                />
            </div>

            <div className="flex items-center gap-2 w-full overflow-x-auto pb-2 sm:pb-0">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 border-dashed">
                            <Filter className="mr-2 h-4 w-4" />
                            Priorité
                            {selectedPriorities.length > 0 && (
                                <Badge variant="secondary" className="ml-2 px-1 rounded-sm font-normal">
                                    {selectedPriorities.length}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                        <DropdownMenuLabel>Filtrer par priorité</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {["low", "medium", "high"].map((priority) => (
                            <DropdownMenuCheckboxItem
                                key={priority}
                                checked={selectedPriorities.includes(priority)}
                                onCheckedChange={() => onPriorityToggle(priority)}
                            >
                                {priority === "low" ? "Basse" : priority === "medium" ? "Moyenne" : "Haute"}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 border-dashed">
                            <Filter className="mr-2 h-4 w-4" />
                            Tags
                            {selectedTags.length > 0 && (
                                <Badge variant="secondary" className="ml-2 px-1 rounded-sm font-normal">
                                    {selectedTags.length}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                        <DropdownMenuLabel>Filtrer par tags</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {availableTags.length === 0 ? (
                            <div className="p-2 text-xs text-muted-foreground">Aucun tag disponible</div>
                        ) : (
                            availableTags.map((tag) => (
                                <DropdownMenuCheckboxItem
                                    key={tag}
                                    checked={selectedTags.includes(tag)}
                                    onCheckedChange={() => onTagToggle(tag)}
                                >
                                    {tag}
                                </DropdownMenuCheckboxItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="h-9 px-2 lg:px-3 text-muted-foreground hover:text-foreground"
                    >
                        Réinitialiser
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
