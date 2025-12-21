import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import CalibratePage from './pages/CalibratePage';
import FreePracticePage from './pages/FreePracticePage';
import RecipePracticePage from './pages/RecipePracticePage';
import ChallengePage from './pages/ChallengePage';
import SettingsPage from './pages/SettingsPage';
import StatsPage from './pages/StatsPage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/calibrate" element={<CalibratePage />} />
                    <Route path="/practice/free" element={<FreePracticePage />} />
                    <Route path="/practice/recipe" element={<RecipePracticePage />} />
                    <Route path="/challenges" element={<ChallengePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
