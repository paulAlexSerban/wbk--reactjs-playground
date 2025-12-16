import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, BoardStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';

interface EditTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task | null;
    statuses: BoardStatus[];
    onSave: (task: Task) => void;
    onDelete?: (taskId: string) => void;
}

export function EditTaskDialog({ open, onOpenChange, task, statuses, onSave, onDelete }: EditTaskDialogProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignee, setAssignee] = useState('');
    const [statusId, setStatusId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [effortHours, setEffortHours] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setAssignee(task.assignee || '');
            setStatusId(task.statusId);
            setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
            setEffortHours(task.effortHours.toString());
        }
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!task) return;

        if (!title.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Title is required',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        // Simulate blockchain transaction
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const updatedTask: Task = {
            ...task,
            title: title.trim(),
            description: description.trim(),
            assignee: assignee.trim() || null,
            statusId,
            dueDate: dueDate ? new Date(dueDate).getTime() : null,
            effortHours: parseInt(effortHours) || 0,
            updatedAt: Date.now(),
        };

        onSave(updatedTask);
        setIsLoading(false);
        onOpenChange(false);

        toast({
            title: 'Task Updated',
            description: 'Task has been updated on-chain',
        });
    };

    const handleDelete = async () => {
        if (!task || !onDelete) return;

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        onDelete(task.id);
        setIsLoading(false);
        onOpenChange(false);

        toast({
            title: 'Task Deleted',
            description: 'Task has been removed from the board',
        });
    };

    if (!task) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-card border-border">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>Update task details. Changes will be recorded on-chain.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Title *</Label>
                        <Input
                            id="edit-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Task title"
                            maxLength={200}
                            className="bg-background border-border"
                        />
                        <p className="text-xs text-muted-foreground text-right">{title.length}/200</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Task description..."
                            maxLength={2000}
                            className="bg-background border-border min-h-[100px]"
                        />
                        <p className="text-xs text-muted-foreground text-right">{description.length}/2000</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={statusId} onValueChange={setStatusId}>
                                <SelectTrigger className="bg-background border-border">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    {statuses.map((status) => (
                                        <SelectItem key={status.id} value={status.id}>
                                            {status.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-effort">Effort (hours)</Label>
                            <Input
                                id="edit-effort"
                                type="number"
                                value={effortHours}
                                onChange={(e) => setEffortHours(e.target.value)}
                                min="0"
                                max="1000"
                                className="bg-background border-border"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-assignee">Assignee (Sui Address)</Label>
                        <Input
                            id="edit-assignee"
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                            placeholder="0x..."
                            className="bg-background border-border font-mono text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-dueDate">Due Date</Label>
                        <Input
                            id="edit-dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="bg-background border-border"
                        />
                    </div>

                    <DialogFooter className="flex justify-between sm:justify-between">
                        {onDelete && (
                            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        )}
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="hero" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
