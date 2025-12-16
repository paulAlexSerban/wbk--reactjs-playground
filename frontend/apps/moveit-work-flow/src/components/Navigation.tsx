import { Link, useLocation } from 'react-router-dom';
import { WalletStatus } from '@/components/WalletStatus';
import { cn } from '@/lib/utils';
import { LayoutGrid, FileText, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navLinks = [
    { href: '/boards', label: 'Boards', icon: LayoutGrid },
    { href: '/about', label: 'About', icon: FileText },
];

export function Navigation() {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-button group-hover:shadow-glow transition-shadow">
                        <span className="text-primary-foreground font-bold text-lg">M</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        Move<span className="gradient-text">It</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive =
                            location.pathname === link.href || location.pathname.startsWith(link.href + '/');
                        return (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Wallet Status */}
                <div className="hidden md:block">
                    <WalletStatus />
                </div>

                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
                    <div className="container mx-auto px-4 py-4 space-y-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div className="pt-2 border-t border-border">
                            <WalletStatus className="w-full justify-center" />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
