import type { ReactNode } from 'react';
import { Header } from './Header';
import { QuizWidget } from '@/components/quiz/QuizWidget';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">{children}</main>
            <QuizWidget />
        </div>
    );
}
