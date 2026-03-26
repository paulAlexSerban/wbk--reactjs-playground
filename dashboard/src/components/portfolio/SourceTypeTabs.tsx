import { cn } from '@/lib/utils';
import { projects } from '@/data/projects';

type SourceType = 'all' | 'app' | 'experiment';

interface SourceTypeTabsProps {
    value: SourceType;
    onChange: (value: SourceType) => void;
}

const appCount = projects.filter((p) => p.sourceType === 'app').length;
const experimentCount = projects.filter((p) => p.sourceType === 'experiment').length;

const tabs: { value: SourceType; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: projects.length },
    { value: 'app', label: 'Apps', count: appCount },
    { value: 'experiment', label: 'Experiments', count: experimentCount },
];

export function SourceTypeTabs({ value, onChange }: SourceTypeTabsProps) {
    return (
        <div className="flex items-center gap-1 border-b border-border mb-8">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    className={cn(
                        'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                        value === tab.value
                            ? 'border-primary text-foreground'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    )}
                >
                    {tab.label}
                    <span
                        className={cn(
                            'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-mono',
                            value === tab.value
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-muted-foreground'
                        )}
                    >
                        {tab.count}
                    </span>
                </button>
            ))}
        </div>
    );
}
