import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BoardStatus } from '@/types';

interface CreateTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    boardId: string;
    statuses: BoardStatus[];
    onSuccess?: () => void;
}

export function CreateTaskDialog({ open, onOpenChange, boardId, statuses, onSuccess }: CreateTaskDialogProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignee, setAssignee] = useState('');
    const [statusId, setStatusId] = useState<string>(statuses[0]?.id || '');
    const [dueDate, setDueDate] = useState('');
    const [effortHours, setEffortHours] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Task title is required',
                variant: 'destructive',
            });
            return;
        }

        if (assignee && !/^0x[a-fA-F0-9]{64}$/.test(assignee)) {
            toast({
                title: 'Validation Error',
                description: 'Invalid Sui address format',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        // Simulate blockchain transaction
        await new Promise((resolve) => setTimeout(resolve, 2000));

        toast({
            title: 'Task Created',
            description: 'Your task has been created on the Sui blockchain',
        });

        setIsLoading(false);
        setTitle('');
        setDescription('');
        setAssignee('');
        setStatusId(statuses[0]?.id || '');
        setDueDate('');
        setEffortHours('');
        onOpenChange(false);
        onSuccess?.();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Create New Task</DialogTitle>
                    <DialogDescription>
                        Add a new task to this board. The task will be stored on-chain as a Sui object.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="title">Title</Label>
                                <span className="text-xs text-muted-foreground">{title.length}/200</span>
                            </div>
                            <Input
                                id="title"
                                placeholder="e.g., Implement smart contract"
                                value={title}
                                onChange={(e) => setTitle(e.target.value.slice(0, 200))}
                                className="bg-secondary border-border"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="description">Description</Label>
                                <span className="text-xs text-muted-foreground">{description.length}/2000</span>
                            </div>
                            <Textarea
                                id="description"
                                placeholder="Describe the task in detail..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
                                className="bg-secondary border-border min-h-[80px] resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={statusId} onValueChange={setStatusId}>
                                    <SelectTrigger className="bg-secondary border-border">
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
                                <Label htmlFor="effort">Effort (hours)</Label>
                                <Input
                                    id="effort"
                                    type="number"
                                    min="0"
                                    max="1000"
                                    placeholder="e.g., 8"
                                    value={effortHours}
                                    onChange={(e) => setEffortHours(e.target.value)}
                                    className="bg-secondary border-border"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assignee">Assignee (Sui Address)</Label>
                            <Input
                                id="assignee"
                                placeholder="0x..."
                                value={assignee}
                                onChange={(e) => setAssignee(e.target.value)}
                                className="bg-secondary border-border font-mono text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="bg-secondary border-border"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="hero" disabled={isLoading || !title.trim()}>
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isLoading ? 'Creating...' : 'Create Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
