import { useState } from 'react';
import { CycleCalendar } from '@/components/CycleCalendar';
import { DayLogEditor } from '@/components/DayLogEditor';

export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
        <div className="min-h-screen bg-background pb-20 safe-top">
            <header className="px-4 pt-6 pb-4">
                <h1 className="text-2xl font-display font-bold text-foreground">Calendar</h1>
                <p className="text-sm text-muted-foreground">Track your cycle</p>
            </header>

            <main className="px-4">
                <CycleCalendar onDayClick={setSelectedDate} selectedDate={selectedDate ?? undefined} />
            </main>

            {selectedDate && <DayLogEditor date={selectedDate} onClose={() => setSelectedDate(null)} />}
        </div>
    );
}
