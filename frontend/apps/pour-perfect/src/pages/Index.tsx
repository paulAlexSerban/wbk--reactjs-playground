import { Link } from 'react-router-dom';
import { Target, BookOpen, Trophy, Settings, Sliders } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/ui/card';
import { useAppState } from '@/hooks/useAppState';

const menuItems = [
    { to: '/practice/free', icon: Target, label: 'Free Practice', description: 'Practice any pour volume' },
    { to: '/practice/recipe', icon: BookOpen, label: 'Recipe Practice', description: 'Practice cocktail recipes' },
    { to: '/challenges', icon: Trophy, label: 'Challenges', description: 'Test your skills' },
    { to: '/calibrate', icon: Sliders, label: 'Calibrate', description: 'Set up your device' },
    { to: '/settings', icon: Settings, label: 'Settings', description: 'Preferences & profiles' },
];

export default function Index() {
    const { currentProfile, isLoading } = useAppState();

    return (
        <AppLayout>
            <div className="px-6 pt-8 pb-6">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Jigger <span className="text-primary">Free</span>
                    </h1>
                    <p className="text-muted-foreground">Master the art of free pouring</p>
                </div>

                {/* Calibration Status */}
                {!currentProfile && !isLoading && (
                    <Card className="mb-6 p-4 border-warning/50 bg-warning/10">
                        <p className="text-sm text-warning">
                            ⚠️ No calibration profile found. Please calibrate your device first.
                        </p>
                    </Card>
                )}

                {/* Menu Grid */}
                <div className="space-y-3">
                    {menuItems.map((item) => (
                        <Link key={item.to} to={item.to}>
                            <Card className="p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors active:scale-[0.98]">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <item.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-foreground">{item.label}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
