import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Construction } from 'lucide-react';

export default function NotFound() {
    const location = useLocation();

    useEffect(() => {
        console.error('404 Error: User attempted to access non-existent route:', location.pathname);
    }, [location.pathname]);

    const isPlaceholder = ['/practice/recipe', '/challenges', '/settings'].includes(location.pathname);

    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Construction className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                    {isPlaceholder ? 'Coming Soon' : 'Page Not Found'}
                </h1>
                <p className="text-muted-foreground text-center">
                    {isPlaceholder
                        ? 'This feature is under construction.'
                        : "The page you're looking for doesn't exist."}
                </p>
            </div>
        </AppLayout>
    );
}
