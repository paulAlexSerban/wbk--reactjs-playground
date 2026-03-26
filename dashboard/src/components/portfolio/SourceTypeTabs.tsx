import type { KeyboardEvent } from 'react';
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
    const selectedIndex = tabs.findIndex((tab) => tab.value === value);

    const focusTab = (index: number) => {
        const tab = tabs[index];
        if (!tab) return;
        const element = document.getElementById(`source-type-tab-${tab.value}`);
        element?.focus();
        onChange(tab.value);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            focusTab((index + 1) % tabs.length);
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            focusTab((index - 1 + tabs.length) % tabs.length);
        }
        if (event.key === 'Home') {
            event.preventDefault();
            focusTab(0);
        }
        if (event.key === 'End') {
            event.preventDefault();
            focusTab(tabs.length - 1);
        }
    };

    return (
        <div className="mb-8 flex items-center gap-1 border-b border-border" role="tablist" aria-label="Project source">
            {tabs.map((tab, index) => (
                <button
                    key={tab.value}
                    id={`source-type-tab-${tab.value}`}
                    role="tab"
                    aria-selected={value === tab.value}
                    aria-controls={`source-type-panel-${tab.value}`}
                    tabIndex={selectedIndex === index ? 0 : -1}
                    onClick={() => onChange(tab.value)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
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
