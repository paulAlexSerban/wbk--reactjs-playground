import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Link2, BarChart3, Wallet, Users, CheckCircle } from 'lucide-react';

const features = [
    {
        icon: Link2,
        title: 'On-Chain Ownership',
        description: 'Your boards and tasks are Sui objects you truly own. No centralized servers, no trust required.',
    },
    {
        icon: Shield,
        title: 'Cryptographic Access Control',
        description: 'Permissions managed via capability NFTs. Only authorized members can modify your data.',
    },
    {
        icon: BarChart3,
        title: 'Transparent & Auditable',
        description: 'Every action recorded on the Sui blockchain. Complete transparency for your team.',
    },
];

const steps = [
    {
        icon: Wallet,
        title: 'Connect Your Wallet',
        description: 'Link your Sui wallet to get started in seconds.',
    },
    {
        icon: Users,
        title: 'Create a Board',
        description: 'Set up your first board and invite team members.',
    },
    {
        icon: CheckCircle,
        title: 'Manage Tasks',
        description: 'Create, assign, and track tasks on-chain.',
    },
];

export default function Index() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-hero" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-glow opacity-50" />

                <div className="container relative mx-auto px-4 py-24 md:py-32">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-in">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            Built on Sui Blockchain
                        </div>

                        <h1
                            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in"
                            style={{ animationDelay: '0.1s' }}
                        >
                            Decentralized Work
                            <br />
                            <span className="gradient-text">Coordination</span>
                        </h1>

                        <p
                            className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in"
                            style={{ animationDelay: '0.2s' }}
                        >
                            Own your tasks. Trust the blockchain. MoveIt brings transparent, crypto-native project
                            management to DAOs and blockchain teams.
                        </p>

                        <div
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
                            style={{ animationDelay: '0.3s' }}
                        >
                            <Button variant="hero" size="xl" asChild>
                                <Link to="/boards">
                                    Get Started
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                            <Button variant="glass" size="xl" asChild>
                                <Link to="/about">Learn More</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 border-t border-border">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why MoveIt?</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Built for the decentralized future of work coordination
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-glow animate-fade-in"
                                    style={{ animationDelay: `${0.1 * index}s` }}
                                >
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-card border-y border-border">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">Get started in three simple steps</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connection Line */}
                        <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-0.5 bg-border -translate-y-1/2" />

                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={step.title}
                                    className="relative flex flex-col items-center text-center animate-fade-in"
                                    style={{ animationDelay: `${0.1 * index}s` }}
                                >
                                    <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center mb-6 shadow-button relative z-10">
                                        <Icon className="h-7 w-7 text-primary-foreground" />
                                    </div>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 text-5xl font-bold text-muted/20">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Ready to Own Your Work?</h2>
                        <p className="text-xl text-muted-foreground">
                            Join the future of decentralized project management on Sui.
                        </p>
                        <Button variant="hero" size="xl" asChild>
                            <Link to="/boards">
                                Start Building
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-border">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">M</span>
                            </div>
                            <span className="font-semibold">MoveIt</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Built with 💜 on Sui Blockchain</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
