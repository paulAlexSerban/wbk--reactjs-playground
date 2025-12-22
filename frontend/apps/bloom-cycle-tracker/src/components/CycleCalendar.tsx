import { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePeriod } from '@/contexts/PeriodContext';
import { Button } from '@/components/ui/button';

interface CycleCalendarProps {
    onDayClick?: (date: Date) => void;
    selectedDate?: Date;
}

export function CycleCalendar({ onDayClick, selectedDate }: CycleCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { data, isPredictedPeriod, isInFertileWindow, isOvulationDay } = usePeriod();

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDayStatus = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const log = data.logs[dateStr];

        return {
            isPeriod: log?.isPeriod ?? false,
            isPredicted: isPredictedPeriod(date),
            isFertile: isInFertileWindow(date),
            isOvulation: isOvulationDay(date),
            hasLog: !!log && (log.symptoms.length > 0 || log.mood || log.painLevel),
            flowIntensity: log?.flowIntensity,
        };
    };

    return (
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="rounded-full"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                <h2 className="text-lg font-display font-semibold text-foreground">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="rounded-full"
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            {/* Week days header */}
            <div className="grid grid-cols-7 mb-2">
                {weekDays.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                    const status = getDayStatus(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isToday = isSameDay(day, new Date());
                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => onDayClick?.(day)}
                            className={cn(
                                'relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all duration-200',
                                'hover:bg-secondary/50',
                                !isCurrentMonth && 'opacity-30',
                                isToday && 'ring-2 ring-primary ring-offset-1 ring-offset-background',
                                isSelected && 'ring-2 ring-foreground',
                                status.isPeriod && 'bg-period text-primary-foreground font-medium',
                                !status.isPeriod &&
                                    status.isPredicted &&
                                    'bg-predicted/50 border-2 border-dashed border-predicted-foreground/30',
                                !status.isPeriod && !status.isPredicted && status.isOvulation && 'bg-ovulation',
                                !status.isPeriod &&
                                    !status.isPredicted &&
                                    !status.isOvulation &&
                                    status.isFertile &&
                                    'bg-fertile/40'
                            )}
                        >
                            <span
                                className={cn(
                                    status.isPeriod && 'text-primary-foreground',
                                    status.isOvulation && !status.isPeriod && 'text-ovulation-foreground font-medium'
                                )}
                            >
                                {format(day, 'd')}
                            </span>

                            {/* Indicator dot for logged symptoms */}
                            {status.hasLog && !status.isPeriod && (
                                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                            )}

                            {/* Bloomw intensity indicator */}
                            {status.isPeriod && status.flowIntensity && (
                                <div className="absolute bottom-1 flex gap-0.5">
                                    {['light', 'medium', 'heavy'].map((level, i) => (
                                        <div
                                            key={level}
                                            className={cn(
                                                'w-1 h-1 rounded-full',
                                                status.flowIntensity === 'spotting' &&
                                                    i === 0 &&
                                                    'bg-primary-foreground/60',
                                                status.flowIntensity === 'light' &&
                                                    i <= 0 &&
                                                    'bg-primary-foreground/80',
                                                status.flowIntensity === 'medium' &&
                                                    i <= 1 &&
                                                    'bg-primary-foreground/80',
                                                status.flowIntensity === 'heavy' && 'bg-primary-foreground',
                                                !(
                                                    (status.flowIntensity === 'spotting' && i === 0) ||
                                                    (status.flowIntensity === 'light' && i <= 0) ||
                                                    (status.flowIntensity === 'medium' && i <= 1) ||
                                                    status.flowIntensity === 'heavy'
                                                ) && 'bg-primary-foreground/30'
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3 justify-center text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-period" />
                    <span>Period</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full border-2 border-dashed border-predicted-foreground/50 bg-predicted/30" />
                    <span>Predicted</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-fertile" />
                    <span>Fertile</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-ovulation" />
                    <span>Ovulation</span>
                </div>
            </div>
        </div>
    );
}
