import { ExternalLink, Github, FileText, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project, ViewMode } from '@/types/project';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
    project: Project;
    viewMode: ViewMode;
    onClick: () => void;
}

export function ProjectCard({ project, viewMode, onClick }: ProjectCardProps) {
    if (viewMode === 'list') {
        return <ListCard project={project} onClick={onClick} />;
    }

    if (viewMode === 'compact') {
        return <CompactCard project={project} onClick={onClick} />;
    }

    return <GridCard project={project} onClick={onClick} />;
}

function GridCard({ project, onClick }: { project: Project; onClick: () => void }) {
    return (
        <Card className="group cursor-pointer overflow-hidden card-hover animate-fade-in" onClick={onClick}>
            <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                    src={`${project.demoUrl}${project.images[0]}`}
                    alt={project.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                {project.featured && (
                    <div className="absolute top-2 right-2">
                        <Badge className="gap-1 bg-syntax-variable text-background">
                            <Star className="h-3 w-3" />
                            Featured
                        </Badge>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground line-clamp-1">{project.name}</h3>
                    <Badge variant="outline" className="shrink-0 font-mono text-xs">
                        {project.category}
                    </Badge>
                </div>
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 3).map((tech) => (
                        <span key={tech} className="tech-badge">
                            {tech}
                        </span>
                    ))}
                    {project.techStack.length > 3 && (
                        <span className="tech-badge">+{project.techStack.length - 3}</span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function ListCard({ project, onClick }: { project: Project; onClick: () => void }) {
    return (
        <Card className="group cursor-pointer card-hover animate-fade-in" onClick={onClick}>
            <div className="flex gap-4 p-4">
                <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img
                        src={`${project.demoUrl}${project.images[0]}`}
                        alt={project.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                    {project.featured && <Star className="absolute top-1 right-1 h-4 w-4 text-syntax-variable" />}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{project.name}</h3>
                            <Badge variant="outline" className="font-mono text-xs">
                                {project.category}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.shortDescription}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                            {project.techStack.slice(0, 4).map((tech) => (
                                <span key={tech} className="tech-badge">
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-1">
                            {project.sourceUrl && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Github className="h-4 w-4" />
                                </Button>
                            )}
                            {project.demoUrl && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function CompactCard({ project, onClick }: { project: Project; onClick: () => void }) {
    return (
        <Card className="group cursor-pointer card-hover animate-fade-in" onClick={onClick}>
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                    src={`${project.demoUrl}${project.images[0]}`}
                    alt={project.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                {project.featured && (
                    <Star className="absolute top-2 right-2 h-4 w-4 text-syntax-variable drop-shadow-md" />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-3 pt-8">
                    <h3 className="font-medium text-foreground text-sm line-clamp-1">{project.name}</h3>
                    <div className="flex gap-1 mt-1">
                        {project.techStack.slice(0, 2).map((tech) => (
                            <span key={tech} className="text-xs text-muted-foreground font-mono">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
