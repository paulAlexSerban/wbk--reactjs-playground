import { FC } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Task } from './Tasks';

type TaskProps = {
    task: Task;
    deleteTask: (id: string) => void;
};

const TaskCmp: FC<TaskProps> = ({ task, deleteTask }) => {
    return (
        <div className="task">
            <h3>
                {task.text}
                <FaTimes style={{ color: 'red' }} onClick={() => deleteTask(task._id)} />
            </h3>
        </div>
    );
};

export default TaskCmp;
