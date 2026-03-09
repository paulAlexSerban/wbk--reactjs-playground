import ProjectsSideBar from './components/ProjectsSideBar';
import NewProject from './components/NewProject';
import NoProjectSelected from './components/NoProjectSelected';
import { useState } from 'react';
import SelectedProject from './components/SelectedProject';

export type Task = {
    id: string;
    text: string;
    completed: boolean;
    projectId: string;
};

export type Project = {
    id: string;
    title: string;
    description: string;
    dueDate: string;
};

type ProjectState = {
    selectedProjectId: string | null | undefined;
    projects: Project[];
    tasks?: Task[];
};

export type AddProjectFormData = {
    title: string;
    description: string;
    dueDate: string;
};

export type AddTaskFormData = {
    title: string;
};

function App() {
    const [projectState, setProjectState] = useState<ProjectState>({
        selectedProjectId: undefined,
        projects: [],
    });

    const handleStartAddProject = () => {
        setProjectState((prevState) => ({
            ...prevState,
            selectedProjectId: null,
        }));
    };

    const handleAddProject: (projectData: AddProjectFormData) => void = (projectData) => {
        setProjectState((prevState) => {
            const projectId = Math.random().toString();
            const newProject = {
                id: projectId,
                ...projectData,
            };
            return {
                ...prevState,
                selectedProjectId: projectId,
                projects: [...prevState.projects, newProject],
            };
        });
    };

    const handleCancelAddProject = () => {
        setProjectState((prevState) => ({
            ...prevState,
            selectedProjectId: undefined,
        }));
    };

    const handleSelectProject = (projectId: string) => {
        setProjectState((prevState) => ({
            ...prevState,
            selectedProjectId: projectId,
        }));
    };

    const handleDeleteProject = () => {
        setProjectState((prevState) => ({
            ...prevState,
            projects: prevState.projects.filter((project) => project.id !== prevState.selectedProjectId),
            selectedProjectId: undefined,
        }));
    };

    const handleAddTask = (text: string) => {
        setProjectState((prevState) => {
            const taskId = Math.random().toString();
            const newTask = {
                id: taskId,
                projectId: prevState.selectedProjectId!,
                text,
                completed: false,
            };

            return {
                ...prevState,
                tasks: [...(prevState.tasks ?? []), newTask],
            };
        });
    };

    const handleDeleteTask = (id: string) => {
        setProjectState((prevState) => ({
            ...prevState,
            tasks: prevState.tasks?.filter((task) => task.id !== id),
        }));
    };

    const selectedProject = projectState.projects.find((project) => project.id === projectState.selectedProjectId);

    let content = (
        <SelectedProject
            project={selectedProject!}
            onDelete={handleDeleteProject}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            tasks={projectState.tasks}
        />
    );

    if (projectState.selectedProjectId === null) {
        content = <NewProject onAdd={handleAddProject} onCancel={handleCancelAddProject} />;
    } else if (projectState.selectedProjectId === undefined) {
        content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
    }

    return (
        <main className="h-screen my-8 flex gap-8">
            <ProjectsSideBar
                onStartAddProject={handleStartAddProject}
                projects={projectState.projects}
                onSelectProject={handleSelectProject}
                selectedProjectId={projectState.selectedProjectId}
            />

            {content}
        </main>
    );
}

export default App;
