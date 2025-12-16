import { Project, ProjectCategory } from '@/types/project';
import projectsJSon from './projects.json';

export const projects = projectsJSon as Project[];

export const allTechStacks = [...new Set(projects.flatMap((p) => p.techStack))].sort();
export const allCategories = projects
    .map((p) => p.category)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort() as ProjectCategory[];
export const featuredProjects = projects.filter((p) => p.featured);
