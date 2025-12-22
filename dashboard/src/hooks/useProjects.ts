import { useMemo, useState } from 'react';
import { Project, FilterState, ViewMode } from '@/types/project';
import { projects as allProjects } from '@/data/projects';

const ITEMS_PER_PAGE = 12;

function fuzzyMatch(text: string, search: string): boolean {
    const searchLower = search.toLowerCase();
    const textLower = text.toLowerCase();

    // Direct includes check
    if (textLower.includes(searchLower)) return true;

    // Fuzzy matching
    let searchIndex = 0;
    for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
        if (textLower[i] === searchLower[searchIndex]) {
            searchIndex++;
        }
    }
    return searchIndex === searchLower.length;
}

export function useProjects() {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        categories: [],
        techStack: [],
        sortBy: 'featured',
        sortOrder: 'desc',
    });
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredProjects = useMemo(() => {
        let result = [...allProjects];

        // Fuzzy search
        if (filters.search) {
            result = result.filter(
                (project) =>
                    fuzzyMatch(project.name, filters.search) ||
                    fuzzyMatch(project.description, filters.search) ||
                    (project.techStack?.some((tech) => fuzzyMatch(tech, filters.search)) ?? false)
            );
        }

        // Category filter
        if (filters.categories.length > 0) {
            result = result.filter((project) => filters.categories.includes(project.category));
        }

        // Tech stack filter
        if (filters.techStack.length > 0) {
            result = result.filter((project) =>
                filters.techStack.some((tech) => project.techStack?.includes(tech) ?? false)
            );
        }

        // Sorting
        result.sort((a, b) => {
            let comparison = 0;
            switch (filters.sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'date':
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case 'featured':
                    comparison = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
                    break;
            }
            return filters.sortOrder === 'desc' ? -comparison : comparison;
        });

        return result;
    }, [filters]);

    const paginatedProjects = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProjects, currentPage]);

    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            categories: [],
            techStack: [],
            sortBy: 'featured',
            sortOrder: 'desc',
        });
        setCurrentPage(1);
    };

    return {
        projects: paginatedProjects,
        allProjects: filteredProjects,
        filters,
        updateFilter,
        resetFilters,
        viewMode,
        setViewMode,
        currentPage,
        setCurrentPage,
        totalPages,
        totalResults: filteredProjects.length,
    };
}
