import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Code, Lock, Globe, Database } from 'lucide-react';

const techStack = [
    {
        icon: Globe,
        title: 'Sui Blockchain',
        description: 'Built on the fast, scalable Sui network with instant finality and low fees.',
    },
    {
        icon: Lock,
        title: 'Move Language',
        description: 'Smart contracts written in Move, a safe and expressive language for digital assets.',
    },
    {
        icon: Database,
        title: 'Object-Centric Model',
        description: 'Boards and tasks are first-class objects with clear ownership on-chain.',
    },
    {
        icon: Shield,
        title: 'Capability-Based Access',
        description: 'Permissions managed via NFT capabilities that can be transferred or revoked.',
    },
];

export default function About() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="container mx-auto px-4 py-16">
                {/* Hero */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Decentralized Work
                        <br />
                        <span className="gradient-text">Coordination on Sui</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        MoveIt is a blockchain-native task management platform that gives you true ownership of your
                        work coordination data. No centralized servers, no vendor lock-in, just transparent
                        collaboration on the Sui blockchain.
                    </p>
                    <Button variant="hero" size="lg" asChild>
                        <Link to="/boards">
                            Start Using MoveIt
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                {/* Why Blockchain */}
                <section className="mb-20">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">Why Blockchain for Task Management?</h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-muted-foreground mb-4">
                                Traditional project management tools store your data on centralized servers controlled
                                by corporations. You don't truly own your data, and your access can be revoked at any
                                time.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                MoveIt changes this paradigm by storing all your boards, tasks, and permissions as
                                objects on the Sui blockchain. When you create a board, you receive an on-chain object
                                that you truly own. When you add members, they receive capability NFTs that grant them
                                specific permissions.
                            </p>
                            <p className="text-muted-foreground">
                                Every action is recorded immutably on-chain, providing complete transparency and
                                auditability for your team. This is especially valuable for DAOs and blockchain teams
                                who value decentralization and trustless coordination.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="mb-20">
                    <h2 className="text-2xl font-bold mb-8 text-center">Technology Stack</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {techStack.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.title}
                                    className="p-6 rounded-xl bg-card border border-border animate-fade-in"
                                    style={{ animationDelay: `${0.1 * index}s` }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Key Features */}
                <section className="mb-20">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-secondary border border-border">
                                <h3 className="font-semibold mb-1 flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-primary" />
                                    On-Chain Boards
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Create project boards as Sui objects with configurable members and permissions.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary border border-border">
                                <h3 className="font-semibold mb-1 flex items-center gap-2">
                                    <Code className="h-4 w-4 text-primary" />
                                    Task Management
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Create, assign, and track tasks with status updates, due dates, and effort
                                    estimates.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary border border-border">
                                <h3 className="font-semibold mb-1 flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-primary" />
                                    Capability-Based Access
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    AdminCap and ContributorCap NFTs control who can manage members and tasks.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center">
                    <div className="inline-block p-8 rounded-2xl bg-gradient-card border border-border">
                        <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
                        <p className="text-muted-foreground mb-6">
                            Connect your Sui wallet and create your first board.
                        </p>
                        <Button variant="hero" size="lg" asChild>
                            <Link to="/boards">
                                Go to Boards
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-8 border-t border-border mt-20">
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
