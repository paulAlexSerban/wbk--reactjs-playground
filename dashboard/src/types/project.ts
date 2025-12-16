export interface Project {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    category: ProjectCategory;
    techStack: string[];
    images: string[];
    sourceUrl?: string;
    demoUrl?: string;
    docsUrl?: string;
    featured: boolean;
    createdAt: string;
    tags: string[];
}

export type ProjectCategory =
    | 'Web App'
    | 'API'
    | 'Mobile'
    | 'CLI Tool'
    | 'Library'
    | 'DevOps'
    | 'AI/ML'
    | 'Blockchain'
    | 'Game'
    | 'Other';

export type ViewMode = 'grid' | 'list' | 'compact';

export type SortOption = 'name' | 'date' | 'featured';

export interface FilterState {
    search: string;
    categories: ProjectCategory[];
    techStack: string[];
    sortBy: SortOption;
    sortOrder: 'asc' | 'desc';
}
