import { useState } from 'react';
import { X, ExternalLink, Github, FileText, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project';
import { cn } from '@/lib/utils';

interface ProjectModalProps {
    project: Project | null;
    open: boolean;
    onClose: () => void;
}

export function ProjectModal({ project, open, onClose }: ProjectModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!project) return null;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
                {/* Image Gallery */}
                <div className="relative aspect-video bg-muted">
                    <img
                        src={`${project.demoUrl}${project.images[currentImageIndex]}`}
                        alt={`${project.name} screenshot ${currentImageIndex + 1}`}
                        className="h-full w-full object-cover"
                    />

                    {project.images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/80 hover:bg-background"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/80 hover:bg-background"
                                onClick={nextImage}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>

                            {/* Image Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {project.images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={cn(
                                            'h-2 w-2 rounded-full transition-all',
                                            index === currentImageIndex
                                                ? 'bg-primary w-6'
                                                : 'bg-background/60 hover:bg-background'
                                        )}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[50vh] scrollbar-thin">
                    <DialogHeader className="mb-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <DialogTitle className="text-2xl font-bold mb-2">{project.name}</DialogTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Badge variant="outline" className="font-mono">
                                        {project.category}
                                    </Badge>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(project.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Description */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                            Description
                        </h4>
                        <p className="text-foreground leading-relaxed">{project.description}</p>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-2">
                            <Tag className="h-3 w-3" />
                            Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <Badge key={tech} variant="secondary" className="font-mono">
                                    {tech}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-3">
                        {project.sourceUrl && (
                            <Button asChild variant="outline" className="gap-2">
                                <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    <Github className="h-4 w-4" />
                                    Source Code
                                </a>
                            </Button>
                        )}
                        {project.demoUrl && (
                            <Button asChild className="gap-2">
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                    Live Demo
                                </a>
                            </Button>
                        )}
                        {project.docsUrl && (
                            <Button asChild variant="secondary" className="gap-2">
                                <a href={project.docsUrl} target="_blank" rel="noopener noreferrer">
                                    <FileText className="h-4 w-4" />
                                    Documentation
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
