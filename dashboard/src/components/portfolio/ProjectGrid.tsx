import { Project, ViewMode } from '@/types/project';
import { ProjectCard } from './ProjectCard';
import { cn } from '@/lib/utils';

interface ProjectGridProps {
    projects: Project[];
    viewMode: ViewMode;
    onProjectClick: (project: Project) => void;
    sourceType: 'all' | 'app' | 'experiment';
    hasActiveFilters: boolean;
    totalProjectsInScope: number;
}

export function ProjectGrid({
    projects,
    viewMode,
    onProjectClick,
    sourceType,
    hasActiveFilters,
    totalProjectsInScope,
}: ProjectGridProps) {
    if (projects.length === 0) {
        const noData = totalProjectsInScope === 0;
        const title = noData ? 'No projects in this section yet' : 'No matching projects found';
        const description = noData
            ? sourceType === 'experiment'
                ? 'No experiments are currently available in the generated metadata.'
                : 'No apps are currently available in the generated metadata.'
            : hasActiveFilters
              ? 'Try adjusting your search, filters, or source tab.'
              : 'Try another source tab or update project metadata.';

        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'gap-4',
                viewMode === 'grid' && 'grid sm:grid-cols-2 lg:grid-cols-3',
                viewMode === 'list' && 'flex flex-col',
                viewMode === 'compact' && 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            )}
        >
            {projects.map((project, index) => (
                <ProjectCard
                    key={project.id || index}
                    project={project}
                    viewMode={viewMode}
                    onClick={() => onProjectClick(project)}
                />
            ))}
        </div>
    );
}
