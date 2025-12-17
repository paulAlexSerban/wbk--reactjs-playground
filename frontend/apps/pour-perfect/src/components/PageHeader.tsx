import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
    title: string;
    showBack?: boolean;
    rightAction?: React.ReactNode;
}

export function PageHeader({ title, showBack = false, rightAction }: PageHeaderProps) {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
            <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
                <div className="w-10">
                    {showBack && (
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-10 w-10">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                </div>
                <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                <div className="w-10 flex justify-end">{rightAction}</div>
            </div>
        </header>
    );
}
