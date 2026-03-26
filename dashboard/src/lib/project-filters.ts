import { FilterState, Project } from '@/types/project';

export function fuzzyMatch(text: string, search: string): boolean {
    const searchLower = search.toLowerCase();
    const textLower = text.toLowerCase();

    if (textLower.includes(searchLower)) return true;

    let searchIndex = 0;
    for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
        if (textLower[i] === searchLower[searchIndex]) {
            searchIndex++;
        }
    }
    return searchIndex === searchLower.length;
}

export function filterProjects(projects: Project[], filters: FilterState): Project[] {
    let result = [...projects];

    if (filters.sourceType !== 'all') {
        result = result.filter((project) => project.sourceType === filters.sourceType);
    }

    if (filters.search) {
        result = result.filter(
            (project) =>
                fuzzyMatch(project.name, filters.search) ||
                fuzzyMatch(project.description, filters.search) ||
                project.techStack.some((tech) => fuzzyMatch(tech, filters.search))
        );
    }

    if (filters.categories.length > 0) {
        result = result.filter((project) => filters.categories.includes(project.category));
    }

    if (filters.techStack.length > 0) {
        result = result.filter((project) =>
            filters.techStack.some((selectedTech) => project.techStack.includes(selectedTech))
        );
    }

    return result;
}

export function sortProjects(projects: Project[], filters: FilterState): Project[] {
    const result = [...projects];

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
}

export function paginateProjects(projects: Project[], currentPage: number, itemsPerPage: number): Project[] {
    const start = (currentPage - 1) * itemsPerPage;
    return projects.slice(start, start + itemsPerPage);
}
