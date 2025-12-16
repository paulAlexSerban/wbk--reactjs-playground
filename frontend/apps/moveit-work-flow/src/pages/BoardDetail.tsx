import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { KanbanBoard } from '@/components/KanbanBoard';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { EditTaskDialog } from '@/components/EditTaskDialog';
import { MemberList } from '@/components/MemberList';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    mockBoards,
    mockTasks,
    mockMembers,
    truncateAddress,
    formatRelativeTime,
    statusColorMap,
} from '@/lib/mockData';
import { Task } from '@/types';
import { ArrowLeft, Plus, Users, Settings, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function BoardDetail() {
    const { boardId } = useParams<{ boardId: string }>();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { toast } = useToast();

    // Find the board (mock data)
    const board = mockBoards.find((b) => b.id === boardId) || mockBoards[0];
    const [tasks, setTasks] = useState(mockTasks.filter((t) => t.boardId === board.id));

    const handleStatusChange = (taskId: string, newStatusId: string) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === taskId ? { ...task, statusId: newStatusId, updatedAt: Date.now() } : task))
        );
        toast({
            title: 'Task Moved',
            description: 'Task status has been updated on-chain',
        });
    };

    const handleTaskClick = (task: Task) => {
        setEditingTask(task);
    };

    const handleTaskSave = (updatedTask: Task) => {
        setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    };

    const handleTaskDelete = (taskId: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
    };

    const taskCounts = board.statuses.reduce(
        (acc, status) => {
            acc[status.id] = tasks.filter((t) => t.statusId === status.id).length;
            return acc;
        },
        {} as Record<string, number>
    );

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <Link
                    to="/boards"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Boards
                </Link>

                {/* Board Header */}
                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold">{board.name}</h1>
                                <Badge variant="admin">Owner</Badge>
                            </div>
                            <p className="text-muted-foreground mb-4">{board.description}</p>

                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <span>Owner:</span>
                                    <span className="font-mono">{truncateAddress(board.owner)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <span>Created:</span>
                                    <span>{formatRelativeTime(board.createdAt)}</span>
                                </div>
                                <a
                                    href={`https://suiexplorer.com/object/${board.id}?network=testnet`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-primary hover:underline"
                                >
                                    View on Explorer
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline">
                                        <Users className="h-4 w-4 mr-2" />
                                        {board.memberCount} Members
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="bg-card border-border">
                                    <SheetHeader>
                                        <SheetTitle>Board Members</SheetTitle>
                                        <SheetDescription>Manage who has access to this board</SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-6">
                                        <MemberList
                                            members={mockMembers}
                                            isAdmin={true}
                                            onAddMember={(address, role) => {
                                                console.log('Add member:', address, role);
                                            }}
                                            onRemoveMember={(address) => {
                                                console.log('Remove member:', address);
                                            }}
                                        />
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <Button variant="outline" size="icon">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Status Stats */}
                    <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-border">
                        {board.statuses.map((status) => (
                            <div
                                key={status.id}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusColorMap[status.color]}`}
                            >
                                <span className="text-sm font-medium">{status.name}:</span>
                                <span className="font-semibold">{taskCounts[status.id] || 0}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Tasks</h2>
                    <Button variant="hero" onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Create Task
                    </Button>
                </div>

                {/* Kanban Board */}
                <KanbanBoard
                    statuses={board.statuses}
                    tasks={tasks}
                    onTaskClick={handleTaskClick}
                    onStatusChange={handleStatusChange}
                />
            </main>

            <CreateTaskDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                boardId={board.id}
                statuses={board.statuses}
                onSuccess={() => {
                    // Refetch tasks
                }}
            />

            <EditTaskDialog
                open={!!editingTask}
                onOpenChange={(open) => !open && setEditingTask(null)}
                task={editingTask}
                statuses={board.statuses}
                onSave={handleTaskSave}
                onDelete={handleTaskDelete}
            />
        </div>
    );
}
