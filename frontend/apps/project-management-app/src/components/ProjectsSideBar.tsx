import { type FC } from 'react';
import Button from './Button';
import { type Project } from '../App';

type ProjectsSideBarProps = {
    projects: Project[];
    onStartAddProject: () => void;
    onSelectProject: (projectId: string) => void;
    selectedProjectId: string | null | undefined;
};
const ProjectsSideBar: FC<ProjectsSideBarProps> = ({
    projects,
    onStartAddProject,
    onSelectProject,
    selectedProjectId,
}) => {
    return (
        <aside className="w-1/3 px-8 py-16 bg-stone-900 text-stone-50 md:w-72 rounded-r-xl">
            <h2 className="font-bold uppercase md:text-xl text-stone-200">Your Projects</h2>
            <Button onClick={onStartAddProject}>+ Add New Project</Button>
            <ul className="mt-8">
                {projects.map((project) => {
                    let cssClasses =
                        'flex items-center gap-2 text-left w-full px-2 py-1 rounded-sm my-1 hover:text-stone-200 hover:bg-stone-800';
                    if (project.id === selectedProjectId) {
                        cssClasses += ' bg-stone-800 text-stone-200';
                    } else {
                        cssClasses += ' text-stone-400';
                    }
                    return (
                        <li key={project.id} className="mt-4">
                            <button onClick={() => onSelectProject(project.id)} className={cssClasses}>
                                <span className="w-3 h-3 bg-stone-500 rounded-full"></span>
                                <span className="font-bold">{project.title}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default ProjectsSideBar;
