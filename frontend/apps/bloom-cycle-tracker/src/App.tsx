import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PeriodProvider } from '@/contexts/PeriodContext';
import { BottomNav } from '@/components/BottomNav';
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage';
import Insights from './pages/Insights';
import Advice from './pages/Advice';
import Settings from './pages/Settings';
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
                    <PeriodProvider>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/calendar" element={<CalendarPage />} />
                            <Route path="/insights" element={<Insights />} />
                            <Route path="/advice" element={<Advice />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                        <BottomNav />
                    </PeriodProvider>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;
