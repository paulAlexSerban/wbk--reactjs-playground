import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, ListTodo, Calendar } from 'lucide-react';
import { Board } from '@/types';
import { formatRelativeTime, truncateAddress } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

interface BoardCardProps {
    board: Board;
}

export function BoardCard({ board }: BoardCardProps) {
    const navigate = useNavigate();

    return (
        <Card variant="interactive" className="group animate-fade-in" onClick={() => navigate(`/boards/${board.id}`)}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="group-hover:text-primary transition-colors">{board.name}</CardTitle>
                    <Badge variant="admin" className="text-xs">
                        Owner
                    </Badge>
                </div>
                <CardDescription className="line-clamp-2 min-h-[2.5rem]">{board.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>{board.memberCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ListTodo className="h-4 w-4" />
                        <span>{board.taskCount} tasks</span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-auto">
                        <Calendar className="h-4 w-4" />
                        <span>{formatRelativeTime(board.createdAt)}</span>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Owner:</span>
                        <span className="text-xs font-mono text-foreground">{truncateAddress(board.owner, 6)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
