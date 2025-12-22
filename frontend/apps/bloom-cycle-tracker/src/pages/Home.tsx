import { useState } from 'react';
import { CycleStatusCard } from '@/components/CycleStatusCard';
import { QuickLog } from '@/components/QuickLog';
import { AnomalyAlerts } from '@/components/AnomalyAlerts';
import { DayLogEditor } from '@/components/DayLogEditor';

export default function Home() {
    const [editingDate, setEditingDate] = useState<Date | null>(null);

    return (
        <div className="min-h-screen bg-background pb-20 safe-top">
            <header className="px-4 pt-6 pb-4">
                <h1 className="text-2xl font-display font-bold text-foreground">Bloom</h1>
                <p className="text-sm text-muted-foreground">Your cycle companion</p>
            </header>

            <main className="px-4 space-y-4">
                <CycleStatusCard />
                <QuickLog onOpenLog={setEditingDate} />
                <AnomalyAlerts />
            </main>

            {editingDate && <DayLogEditor date={editingDate} onClose={() => setEditingDate(null)} />}
        </div>
    );
}
