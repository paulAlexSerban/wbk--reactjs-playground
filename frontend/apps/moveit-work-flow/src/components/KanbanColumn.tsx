import { Task, BoardStatus } from '@/types';
import { KanbanCard } from './KanbanCard';
import { statusHeaderColorMap } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
    status: BoardStatus;
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onDropTask: (taskId: string, statusId: string) => void;
}

export function KanbanColumn({ status, tasks, onTaskClick, onDropTask }: KanbanColumnProps) {
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-primary/5');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('bg-primary/5');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-primary/5');
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            onDropTask(taskId, status.id);
        }
    };

    return (
        <div
            className={cn(
                'flex flex-col min-w-[280px] max-w-[320px] bg-secondary/30 rounded-xl border-t-2 transition-colors',
                statusHeaderColorMap[status.color]
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Column Header */}
            <div className="flex items-center justify-between p-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{status.name}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                </div>
            </div>

            {/* Tasks */}
            <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-320px)]">
                {tasks.map((task) => (
                    <KanbanCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                ))}
                {tasks.length === 0 && (
                    <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">No tasks</div>
                )}
            </div>
        </div>
    );
}
