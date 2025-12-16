import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { BoardCard } from '@/components/BoardCard';
import { CreateBoardDialog } from '@/components/CreateBoardDialog';
import { Button } from '@/components/ui/button';
import { mockBoards } from '@/lib/mockData';
import { Plus, LayoutGrid, Loader2 } from 'lucide-react';

export default function Boards() {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [boards, setBoards] = useState(mockBoards);
    const [isLoading, setIsLoading] = useState(false);

    const handleBoardCreated = () => {
        // In a real app, this would refetch from blockchain
        // For now, we just simulate
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Your Boards</h1>
                        <p className="text-muted-foreground">Manage your decentralized project boards on Sui</p>
                    </div>
                    <Button variant="hero" onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Create Board
                    </Button>
                </div>

                {/* Boards Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : boards.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {boards.map((board, index) => (
                            <div key={board.id} style={{ animationDelay: `${0.05 * index}s` }}>
                                <BoardCard board={board} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
                            <LayoutGrid className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No boards yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                            Create your first board to start managing tasks on the blockchain.
                        </p>
                        <Button variant="hero" onClick={() => setCreateDialogOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Create Your First Board
                        </Button>
                    </div>
                )}
            </main>

            <CreateBoardDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={handleBoardCreated}
            />
        </div>
    );
}
