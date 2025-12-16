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
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateBoardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateBoardDialog({ open, onOpenChange, onSuccess }: CreateBoardDialogProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Board name is required',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        // Simulate blockchain transaction
        await new Promise((resolve) => setTimeout(resolve, 2000));

        toast({
            title: 'Board Created',
            description: 'Your board has been created on the Sui blockchain',
        });

        setIsLoading(false);
        setName('');
        setDescription('');
        onOpenChange(false);
        onSuccess?.();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Create New Board</DialogTitle>
                    <DialogDescription>
                        Create a new board to organize tasks. This will create a Board object on the Sui blockchain.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="name">Board Name</Label>
                                <span className="text-xs text-muted-foreground">{name.length}/100</span>
                            </div>
                            <Input
                                id="name"
                                placeholder="e.g., Protocol Development"
                                value={name}
                                onChange={(e) => setName(e.target.value.slice(0, 100))}
                                className="bg-secondary border-border"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="description">Description</Label>
                                <span className="text-xs text-muted-foreground">{description.length}/500</span>
                            </div>
                            <Textarea
                                id="description"
                                placeholder="Describe the purpose of this board..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                                className="bg-secondary border-border min-h-[100px] resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="hero" disabled={isLoading || !name.trim()}>
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isLoading ? 'Creating...' : 'Create Board'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
