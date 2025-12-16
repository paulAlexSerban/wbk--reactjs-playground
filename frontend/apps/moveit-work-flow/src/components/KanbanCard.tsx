import { Task } from '@/types';
import { truncateAddress, formatDate, isOverdue } from '@/lib/mockData';
import { Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
    task: Task;
    onClick: () => void;
}

export function KanbanCard({ task, onClick }: KanbanCardProps) {
    const overdue = isOverdue(task.dueDate);

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('taskId', task.id);
        e.currentTarget.classList.add('opacity-50');
    };

    const handleDragEnd = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('opacity-50');
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={onClick}
            className="bg-card border border-border rounded-lg p-3 cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group"
        >
            <h4 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {task.title}
            </h4>

            {task.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
                {task.assignee ? (
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="font-mono">{truncateAddress(task.assignee, 4)}</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground/50">Unassigned</span>
                )}

                {task.dueDate && (
                    <div className={cn('flex items-center gap-1', overdue && 'text-destructive')}>
                        <Clock className="h-3 w-3" />
                        <span>{overdue ? 'Overdue' : formatDate(task.dueDate)}</span>
                    </div>
                )}
            </div>

            {task.effortHours > 0 && (
                <div className="mt-2 pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">{task.effortHours}h effort</span>
                </div>
            )}
        </div>
    );
}
