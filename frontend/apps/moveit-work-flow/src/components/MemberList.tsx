import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Member } from '@/types';
import { truncateAddress, formatRelativeTime } from '@/lib/mockData';
import { UserPlus, Crown, User, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MemberListProps {
    members: Member[];
    isAdmin: boolean;
    onAddMember?: (address: string, role: 'admin' | 'contributor') => void;
    onRemoveMember?: (address: string) => void;
}

export function MemberList({ members, isAdmin, onAddMember, onRemoveMember }: MemberListProps) {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newAddress, setNewAddress] = useState('');
    const [newRole, setNewRole] = useState<'admin' | 'contributor'>('contributor');
    const { toast } = useToast();

    const handleAddMember = () => {
        if (!/^0x[a-fA-F0-9]{64}$/.test(newAddress)) {
            toast({
                title: 'Invalid Address',
                description: 'Please enter a valid Sui address',
                variant: 'destructive',
            });
            return;
        }

        onAddMember?.(newAddress, newRole);
        setNewAddress('');
        setNewRole('contributor');
        setAddDialogOpen(false);
        toast({
            title: 'Member Added',
            description: `Successfully added ${truncateAddress(newAddress)} as ${newRole}`,
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Members ({members.length})</h3>
                {isAdmin && (
                    <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border">
                            <DialogHeader>
                                <DialogTitle>Add Member</DialogTitle>
                                <DialogDescription>
                                    Add a new member to this board. They will receive a capability NFT.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Sui Address</Label>
                                    <Input
                                        id="address"
                                        placeholder="0x..."
                                        value={newAddress}
                                        onChange={(e) => setNewAddress(e.target.value)}
                                        className="bg-secondary border-border font-mono"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label>Role</Label>
                                    <RadioGroup
                                        value={newRole}
                                        onValueChange={(v) => setNewRole(v as 'admin' | 'contributor')}
                                    >
                                        <div className="flex items-start space-x-3 p-3 rounded-lg bg-secondary border border-border">
                                            <RadioGroupItem value="admin" id="admin" className="mt-1" />
                                            <div>
                                                <Label htmlFor="admin" className="cursor-pointer font-medium">
                                                    Admin
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Can manage members, create, update, and delete all tasks
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 p-3 rounded-lg bg-secondary border border-border">
                                            <RadioGroupItem value="contributor" id="contributor" className="mt-1" />
                                            <div>
                                                <Label htmlFor="contributor" className="cursor-pointer font-medium">
                                                    Contributor
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Can create and update tasks assigned to them
                                                </p>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="hero" onClick={handleAddMember}>
                                    Add Member
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="space-y-2">
                {members.map((member) => (
                    <div
                        key={member.address}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border"
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                {member.role === 'admin' ? (
                                    <Crown className="h-4 w-4 text-primary" />
                                ) : (
                                    <User className="h-4 w-4 text-muted-foreground" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm">{truncateAddress(member.address, 8)}</span>
                                    <Badge variant={member.role === 'admin' ? 'admin' : 'contributor'}>
                                        {member.role}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Joined {formatRelativeTime(member.joinedAt)}
                                </p>
                            </div>
                        </div>
                        {isAdmin && member.role !== 'admin' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => onRemoveMember?.(member.address)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
