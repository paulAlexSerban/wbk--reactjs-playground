import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
    Hand,
    Droplets,
    Vibrate,
    Eye,
    RotateCcw,
    ChevronRight,
    Timer,
    User,
    Settings2,
    Smartphone,
    Scale,
} from 'lucide-react';
import { preferencesDB, calibrationDB } from '@/lib/db';
import { SPOUT_TYPES } from '@/lib/seed-data';
import { useHaptics } from '@/hooks/useHaptics';
import type { UserPreferences, CalibrationProfile, CountingMethod, Handedness, VolumeUnit } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
    const navigate = useNavigate();
    const haptics = useHaptics();
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [profiles, setProfiles] = useState<CalibrationProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [prefs, profileList] = await Promise.all([preferencesDB.get(), calibrationDB.getAll()]);
        setPreferences(prefs);
        setProfiles(profileList);
        setIsLoading(false);
    };

    const updatePreference = async <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
        if (!preferences) return;

        const updated = { ...preferences, [key]: value };
        setPreferences(updated);
        await preferencesDB.save(updated);

        if (key === 'haptic_enabled' && value) {
            haptics.tap();
        }

        toast.success('Setting saved');
    };

    const deleteProfile = async (id: string) => {
        await calibrationDB.delete(id);
        setProfiles((prev) => prev.filter((p) => p.id !== id));
        toast.success('Profile deleted');
    };

    const setActiveProfile = async (id: string) => {
        if (!preferences) return;
        await updatePreference('current_profile_id', id);
        toast.success('Profile activated');
    };

    if (isLoading || !preferences) {
        return (
            <AppLayout>
                <PageHeader title="Settings" />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <PageHeader title="Settings" />

            <div className="px-4 pb-24 space-y-6">
                {/* User Preferences */}
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                        <User className="h-4 w-4" />
                        User Preferences
                    </h2>

                    <Card className="p-4 bg-card border-border space-y-4">
                        {/* Handedness */}
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2">
                                <Hand className="h-4 w-4 text-primary" />
                                Dominant Hand
                            </Label>
                            <RadioGroup
                                value={preferences.handedness}
                                onValueChange={(v) => updatePreference('handedness', v as Handedness)}
                                className="flex gap-4"
                            >
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="left" id="left" />
                                    <Label htmlFor="left" className="cursor-pointer">
                                        Left
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="right" id="right" />
                                    <Label htmlFor="right" className="cursor-pointer">
                                        Right
                                    </Label>
                                </div>
                            </RadioGroup>
                            <p className="text-xs text-muted-foreground">UI will mirror to match your pouring hand</p>
                        </div>

                        <Separator />

                        {/* Counting Method */}
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2">
                                <Timer className="h-4 w-4 text-primary" />
                                Counting Method
                            </Label>
                            <Select
                                value={preferences.counting_method}
                                onValueChange={(v) => updatePreference('counting_method', v as CountingMethod)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="seconds">Seconds (1, 2, 3...)</SelectItem>
                                    <SelectItem value="beats">Beats (1-and-2-and...)</SelectItem>
                                    <SelectItem value="1-and-a-2">Mississippi (1-and-a-2...)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />

                        {/* Spout Type */}
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-primary" />
                                Spout Type
                            </Label>
                            <Select value={preferences.spout_id} onValueChange={(v) => updatePreference('spout_id', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SPOUT_TYPES.map((spout) => (
                                        <SelectItem key={spout.id} value={spout.id}>
                                            <div>
                                                <p>{spout.name}</p>
                                                <p className="text-xs text-muted-foreground">{spout.description}</p>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />

                        {/* Volume Unit */}
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2">
                                <Scale className="h-4 w-4 text-primary" />
                                Volume Unit
                            </Label>
                            <RadioGroup
                                value={preferences.volume_unit}
                                onValueChange={(v) => updatePreference('volume_unit', v as VolumeUnit)}
                                className="flex gap-4"
                            >
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="oz" id="oz" />
                                    <Label htmlFor="oz" className="cursor-pointer">
                                        Ounces (oz)
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="ml" id="ml" />
                                    <Label htmlFor="ml" className="cursor-pointer">
                                        Milliliters (ml)
                                    </Label>
                                </div>
                            </RadioGroup>
                            <p className="text-xs text-muted-foreground">
                                All volumes will be displayed in your chosen unit
                            </p>
                        </div>
                    </Card>
                </section>

                {/* Accessibility */}
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                        <Settings2 className="h-4 w-4" />
                        Accessibility
                    </h2>

                    <Card className="p-4 bg-card border-border space-y-4">
                        {/* Haptic Feedback */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Vibrate className="h-5 w-5 text-primary" />
                                <div>
                                    <Label>Haptic Feedback</Label>
                                    <p className="text-xs text-muted-foreground">Vibration on pour events</p>
                                </div>
                            </div>
                            <Switch
                                checked={preferences.haptic_enabled}
                                onCheckedChange={(v) => updatePreference('haptic_enabled', v)}
                            />
                        </div>

                        <Separator />

                        {/* High Contrast */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Eye className="h-5 w-5 text-primary" />
                                <div>
                                    <Label>High Contrast</Label>
                                    <p className="text-xs text-muted-foreground">Enhanced visibility mode</p>
                                </div>
                            </div>
                            <Switch
                                checked={preferences.high_contrast}
                                onCheckedChange={(v) => updatePreference('high_contrast', v)}
                            />
                        </div>
                    </Card>
                </section>

                {/* Calibration Profiles */}
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Calibration Profiles
                    </h2>

                    <Card className="bg-card border-border overflow-hidden divide-y divide-border">
                        {profiles.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground">
                                <RotateCcw className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No calibration profiles yet</p>
                                <Button
                                    variant="link"
                                    className="text-primary mt-2"
                                    onClick={() => navigate('/calibrate')}
                                >
                                    Create your first profile
                                </Button>
                            </div>
                        ) : (
                            profiles.map((profile) => {
                                const isActive = preferences.current_profile_id === profile.id;
                                const spout = SPOUT_TYPES.find((s) => s.id === profile.spout_id);

                                return (
                                    <div
                                        key={profile.id}
                                        className={`p-4 flex items-center justify-between ${isActive ? 'bg-primary/5' : ''}`}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-foreground">
                                                    {spout?.name || profile.spout_id}
                                                </p>
                                                {isActive && (
                                                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {profile.handedness} hand •{' '}
                                                {new Date(profile.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!isActive && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setActiveProfile(profile.id)}
                                                >
                                                    Use
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => deleteProfile(profile.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </Card>

                    <Button variant="outline" className="w-full" onClick={() => navigate('/calibrate')}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        New Calibration
                    </Button>
                </section>

                {/* App Info */}
                <section className="space-y-3">
                    <Card className="p-4 bg-card border-border">
                        <div className="text-center text-sm text-muted-foreground">
                            <p className="font-medium text-foreground">Jigger Free</p>
                            <p>Version 1.0.0</p>
                            <p className="mt-2 text-xs">
                                All data stored locally on your device.
                                <br />
                                No tracking. No analytics.
                            </p>
                        </div>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
