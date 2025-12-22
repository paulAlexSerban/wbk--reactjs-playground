import { FC } from 'react';
import Task from './Task';

export type Task = {
    _id: string;
    text: string;
};

export type TasksProps = {
    tasks: Task[];
    deleteTask: (id: string) => void;
};

const Tasks: FC<TasksProps> = ({ tasks, deleteTask }) => {
    return (
        <>
            {tasks.map((task, index) => (
                <Task key={index} task={task} deleteTask={deleteTask} />
            ))}
        </>
    );
};

export default Tasks;
