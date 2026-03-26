import { useState } from 'react';
import { Star, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project';
import { featuredProjects } from '@/data/projects';

interface FeaturedSectionProps {
    onProjectClick: (project: Project) => void;
}

export function FeaturedSection({ onProjectClick }: FeaturedSectionProps) {
    return (
        <section className="mb-12">
            <div className="mb-6 flex items-center gap-3">
                <Star className="h-5 w-5 text-syntax-variable" />
                <h2 className="text-xl font-semibold">Featured Projects</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.slice(0, 3).map((project, index) => (
                    <FeaturedCard key={project.id} project={project} index={index} onProjectClick={onProjectClick} />
                ))}
            </div>
        </section>
    );
}

function FeaturedCard({
    project,
    index,
    onProjectClick,
}: {
    project: Project;
    index: number;
    onProjectClick: (project: Project) => void;
}) {
    const [imageError, setImageError] = useState(false);
    const imageUrl = project.images?.[0] && project.demoUrl ? `${project.demoUrl}${project.images[0]}` : undefined;

    return (
        <Card
            key={project.id}
            className={`group cursor-pointer overflow-hidden card-hover animate-fade-in ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onProjectClick(project)}
        >
            <div
                className={`relative overflow-hidden bg-muted ${index === 0 ? 'aspect-video md:aspect-[2/1]' : 'aspect-video'}`}
            >
                {imageUrl && !imageError ? (
                    <img
                        src={imageUrl}
                        alt={project.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                        <FileText className="h-12 w-12" />
                        <p className="px-2 text-center text-xs font-mono">Featured preview unavailable</p>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge className="mb-3 gap-1 bg-syntax-variable text-background">
                        <Star className="h-3 w-3" />
                        Featured
                    </Badge>
                    <h3 className={`font-bold text-foreground mb-2 ${index === 0 ? 'text-2xl' : 'text-lg'}`}>
                        {project.name}
                    </h3>
                    <p
                        className={`text-muted-foreground mb-3 ${index === 0 ? 'text-base line-clamp-2' : 'text-sm line-clamp-1'}`}
                    >
                        {project.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {project.techStack.slice(0, index === 0 ? 4 : 3).map((tech) => (
                            <span key={tech} className="tech-badge">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
