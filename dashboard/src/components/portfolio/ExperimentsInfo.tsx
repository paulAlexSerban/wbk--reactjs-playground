import { FlaskConical } from 'lucide-react';

export function ExperimentsInfo() {
    return (
        <div className="mb-8 flex items-start gap-4 rounded-lg border border-border bg-secondary/50 p-4">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-syntax-variable/15 text-syntax-variable">
                <FlaskConical className="h-5 w-5" />
            </div>
            <div>
                <h3 className="mb-1 font-semibold text-foreground">Experiments</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    These are R&amp;D sandboxes and UI variants used to explore specific React patterns, performance
                    techniques, or alternative styling approaches. They may lack screenshots, live demos, or production
                    polish — that's by design.
                </p>
            </div>
        </div>
    );
}
