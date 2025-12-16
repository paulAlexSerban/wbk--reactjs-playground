import { ChevronDown, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FilterState, ProjectCategory, SortOption } from '@/types/project';
import { allCategories, allTechStacks } from '@/data/projects';

interface FilterControlsProps {
    filters: FilterState;
    updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
    resetFilters: () => void;
    totalResults: number;
}

const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date' },
];

export function FilterControls({ filters, updateFilter, resetFilters, totalResults }: FilterControlsProps) {
    const hasActiveFilters = filters.categories.length > 0 || filters.techStack.length > 0;

    const toggleCategory = (category: ProjectCategory) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter((c) => c !== category)
            : [...filters.categories, category];
        updateFilter('categories', newCategories);
    };

    const toggleTech = (tech: string) => {
        const newTech = filters.techStack.includes(tech)
            ? filters.techStack.filter((t) => t !== tech)
            : [...filters.techStack, tech];
        updateFilter('techStack', newTech);
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Category
                        {filters.categories.length > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                                {filters.categories.length}
                            </Badge>
                        )}
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuLabel>Categories</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allCategories.map((category) => (
                        <DropdownMenuCheckboxItem
                            key={category}
                            checked={filters.categories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                        >
                            {category}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Tech Stack Filter */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        Tech Stack
                        {filters.techStack.length > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                                {filters.techStack.length}
                            </Badge>
                        )}
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 max-h-64 overflow-y-auto">
                    <DropdownMenuLabel>Technologies</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allTechStacks.map((tech) => (
                        <DropdownMenuCheckboxItem
                            key={tech}
                            checked={filters.techStack.includes(tech)}
                            onCheckedChange={() => toggleTech(tech)}
                        >
                            <span className="font-mono text-xs">{tech}</span>
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <ArrowUpDown className="h-4 w-4" />
                        Sort: {sortOptions.find((o) => o.value === filters.sortBy)?.label}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {sortOptions.map((option) => (
                        <DropdownMenuItem key={option.value} onClick={() => updateFilter('sortBy', option.value)}>
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                        {filters.sortOrder === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-2 text-muted-foreground">
                    <X className="h-4 w-4" />
                    Clear
                </Button>
            )}

            {/* Results Count */}
            <span className="ml-auto text-sm text-muted-foreground font-mono">{totalResults} projects</span>
        </div>
    );
}
