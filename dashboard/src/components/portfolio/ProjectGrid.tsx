import { Project, ViewMode } from '@/types/project';
import { ProjectCard } from './ProjectCard';
import { cn } from '@/lib/utils';

interface ProjectGridProps {
    projects: Project[];
    viewMode: ViewMode;
    onProjectClick: (project: Project) => void;
}

export function ProjectGrid({ projects, viewMode, onProjectClick }: ProjectGridProps) {
    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
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
