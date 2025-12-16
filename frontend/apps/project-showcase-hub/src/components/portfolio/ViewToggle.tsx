import { Grid3X3, List, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/types/project';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
    viewMode: ViewMode;
    onChange: (mode: ViewMode) => void;
}

const views: { mode: ViewMode; icon: typeof Grid3X3; label: string }[] = [
    { mode: 'grid', icon: LayoutGrid, label: 'Grid' },
    { mode: 'list', icon: List, label: 'List' },
    { mode: 'compact', icon: Grid3X3, label: 'Compact' },
];

export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
    return (
        <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary p-1">
            {views.map(({ mode, icon: Icon, label }) => (
                <Button
                    key={mode}
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange(mode)}
                    className={cn('h-8 px-3 gap-2', viewMode === mode && 'bg-background shadow-sm')}
                >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs">{label}</span>
                </Button>
            ))}
        </div>
    );
}
