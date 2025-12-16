import { Moon, Sun, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                        <Terminal className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold font-mono">
                            <span className="text-syntax-keyword">const</span>{' '}
                            <span className="text-syntax-variable">portfolio</span>{' '}
                            <span className="text-muted-foreground">=</span>{' '}
                            <span className="text-syntax-string">"projects"</span>
                        </h1>
                    </div>
                </div>

                <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-10 w-10">
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>
    );
}
