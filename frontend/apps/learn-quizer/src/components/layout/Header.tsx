import { Link } from 'react-router-dom';

export function Header() {
    return (
        <header className="border-b-2 border-border bg-background">
            <div className="container max-w-4xl mx-auto px-4 py-6">
                <Link to="/" className="inline-block">
                    <h1 className="text-xl font-mono font-bold tracking-tight">Engineer's Learning Blog</h1>
                    <p className="text-sm text-muted-foreground font-mono">Learn. Retain. Build.</p>
                </Link>
            </div>
        </header>
    );
}
