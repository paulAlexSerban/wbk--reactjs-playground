import { usePeriod } from '@/contexts/PeriodContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Download, Trash2, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Settings() {
    const { data, updateProfile, exportData, clearAllData } = usePeriod();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        setIsDark(!isDark);
        updateProfile({ theme: !isDark ? 'dark' : 'light' });
    };

    return (
        <div className="min-h-screen bg-background pb-20 safe-top">
            <header className="px-4 pt-6 pb-4">
                <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">Customize your experience</p>
            </header>

            <main className="px-4 space-y-6">
                {/* Profile */}
                <section className="bg-card rounded-2xl p-4 border border-border space-y-4">
                    <h2 className="font-display font-semibold">Profile</h2>

                    <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                            id="age"
                            type="number"
                            placeholder="Your age"
                            value={data.profile.age || ''}
                            onChange={(e) => updateProfile({ age: parseInt(e.target.value) || undefined })}
                            className="rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
                        <Input
                            id="cycleLength"
                            type="number"
                            value={data.profile.averageCycleLength}
                            onChange={(e) => updateProfile({ averageCycleLength: parseInt(e.target.value) || 28 })}
                            className="rounded-xl"
                        />
                    </div>
                </section>

                {/* Appearance */}
                <section className="bg-card rounded-2xl p-4 border border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            <span className="font-medium">Dark Mode</span>
                        </div>
                        <Switch checked={isDark} onCheckedChange={toggleTheme} />
                    </div>
                </section>

                {/* Data */}
                <section className="bg-card rounded-2xl p-4 border border-border space-y-3">
                    <h2 className="font-display font-semibold">Your Data</h2>
                    <p className="text-sm text-muted-foreground">All data is stored locally on your device.</p>

                    <Button variant="outline" className="w-full rounded-xl" onClick={exportData}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full rounded-xl text-destructive hover:text-destructive"
                        onClick={() => {
                            if (confirm('Are you sure? This will delete all your data.')) {
                                clearAllData();
                            }
                        }}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All Data
                    </Button>
                </section>

                <p className="text-center text-xs text-muted-foreground">
                    🌸 Bloom Period Tracker • Your privacy matters
                </p>
            </main>
        </div>
    );
}
