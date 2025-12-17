import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Boards from './pages/Boards';
import BoardDetail from './pages/BoardDetail';
import About from './pages/About';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30000,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
});

const App = () => {
    const DOMAIN_PATH = import.meta.env.VITE_DOMAIN_PATH;
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter basename={DOMAIN_PATH}>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/boards" element={<Boards />} />
                        <Route path="/boards/:boardId" element={<BoardDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;
