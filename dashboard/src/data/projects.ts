import { Project, ProjectCategory } from '@/types/project';
import projectsJSon from './projects.json';

const normalizedProjects = (projectsJSon as Array<Partial<Project>>).map((project) => {
    const sourceType = project.sourceType ?? (project.demoUrl ? 'app' : 'experiment');

    return {
        ...project,
        sourceType,
    } as Project;
});

export const projects = normalizedProjects;

export const appProjects = projects.filter((p) => p.sourceType === 'app');
export const experimentProjects = projects.filter((p) => p.sourceType === 'experiment');

export const allTechStacks = [...new Set(projects.flatMap((p) => p.techStack))].sort();
export const allCategories = projects
    .map((p) => p.category)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort() as ProjectCategory[];
export const featuredProjects = projects.filter((p) => p.featured);
