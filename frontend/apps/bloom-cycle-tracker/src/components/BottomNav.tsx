import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, TrendingUp, Heart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
    { path: '/advice', icon: Heart, label: 'Advice' },
    { path: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border safe-bottom z-50">
            <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
                {navItems.map(({ path, icon: Icon, label }) => {
                    const isActive = location.pathname === path;

                    return (
                        <NavLink
                            key={path}
                            to={path}
                            className={cn(
                                'flex flex-col items-center justify-center flex-1 h-full transition-all duration-200',
                                'hover:bg-secondary/50 rounded-xl mx-0.5',
                                isActive ? 'text-primary' : 'text-muted-foreground'
                            )}
                        >
                            <Icon
                                className={cn(
                                    'w-5 h-5 mb-1 transition-transform duration-200',
                                    isActive && 'scale-110'
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className={cn('text-[10px] font-medium', isActive && 'font-semibold')}>{label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
