import { useMemo, useState } from 'react';
import { Project, FilterState, ViewMode } from '@/types/project';
import { projects as allProjects } from '@/data/projects';
import { filterProjects, paginateProjects, sortProjects } from '@/lib/project-filters';

const ITEMS_PER_PAGE = 12;

export function useProjects() {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        categories: [],
        techStack: [],
        sortBy: 'featured',
        sortOrder: 'desc',
        sourceType: 'all',
    });
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredProjects = useMemo(() => {
        const result = filterProjects(allProjects, filters);
        return sortProjects(result, filters);
    }, [filters]);

    const paginatedProjects = useMemo(() => {
        return paginateProjects(filteredProjects, currentPage, ITEMS_PER_PAGE);
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
            sourceType: 'all',
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
