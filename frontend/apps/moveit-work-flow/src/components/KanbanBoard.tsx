import { Task, BoardStatus } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface KanbanBoardProps {
    statuses: BoardStatus[];
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onStatusChange: (taskId: string, statusId: string) => void;
}

export function KanbanBoard({ statuses, tasks, onTaskClick, onStatusChange }: KanbanBoardProps) {
    const sortedStatuses = [...statuses].sort((a, b) => a.order - b.order);

    const getTasksForStatus = (statusId: string) => {
        return tasks.filter((task) => task.statusId === statusId);
    };

    return (
        <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4 min-w-max">
                {sortedStatuses.map((status) => (
                    <KanbanColumn
                        key={status.id}
                        status={status}
                        tasks={getTasksForStatus(status.id)}
                        onTaskClick={onTaskClick}
                        onDropTask={onStatusChange}
                    />
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
