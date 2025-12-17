import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QuizProvider } from '@/components/quiz/QuizContext';
import Index from './pages/Index';
import Post from './pages/Post';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => {
    const DOMAIN_PATH = import.meta.env.VITE_DOMAIN_PATH;
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <QuizProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter basename={DOMAIN_PATH}>
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/post/:slug" element={<Post />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </QuizProvider>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;
