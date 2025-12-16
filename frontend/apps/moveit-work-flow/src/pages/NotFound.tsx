import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error('404 Error: User attempted to access non-existent route:', location.pathname);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                <div className="text-center px-4">
                    <div className="text-8xl font-bold gradient-text mb-4">404</div>
                    <h1 className="text-2xl font-semibold mb-2">Page Not Found</h1>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Button variant="outline" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                        <Button variant="hero" asChild>
                            <Link to="/">
                                <Home className="h-4 w-4 mr-2" />
                                Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
