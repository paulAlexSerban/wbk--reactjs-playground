import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import CalibratePage from './pages/CalibratePage';
import FreePracticePage from './pages/FreePracticePage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

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
                        <Route path="/calibrate" element={<CalibratePage />} />
                        <Route path="/practice/free" element={<FreePracticePage />} />
                        <Route path="/practice/recipe" element={<NotFound />} />
                        <Route path="/challenges" element={<NotFound />} />
                        <Route path="/settings" element={<NotFound />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;
