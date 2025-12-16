import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlogPost as BlogPostType } from '@/types/quiz';
import { useQuizContext } from '@/components/quiz/QuizContext';
import { cn } from '@/lib/utils';

interface BlogPostProps {
    post: BlogPostType;
}

export function BlogPost({ post }: BlogPostProps) {
    const { addQuestionsFromPost, isPostAdded } = useQuizContext();
    const [isAdded, setIsAdded] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        isPostAdded(post.slug).then(setIsAdded);
    }, [post.slug, isPostAdded]);

    const handleAddQuestions = async () => {
        setIsAdding(true);
        try {
            await addQuestionsFromPost(post);
            setIsAdded(true);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <article className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-12">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to posts
                </Link>

                <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 text-xs font-mono bg-secondary border border-border">
                        {post.subject}
                    </span>
                    <time className="text-xs font-mono text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight mb-4">{post.title}</h1>

                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <span key={tag} className="text-xs font-mono text-muted-foreground">
                            #{tag}
                        </span>
                    ))}
                </div>
            </header>

            {/* Content */}
            <div className="prose prose-neutral dark:prose-invert max-w-none mb-16">
                <MarkdownContent content={post.content} />
            </div>

            {/* Quiz CTA */}
            {post.questions.length > 0 && (
                <section className="border-2 border-border p-6 bg-secondary/30">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="font-mono font-bold mb-1">Test Your Understanding</h3>
                            <p className="text-sm text-muted-foreground font-mono">
                                {post.questions.length} question{post.questions.length > 1 ? 's' : ''} available for
                                spaced repetition learning
                            </p>
                        </div>

                        <Button
                            onClick={handleAddQuestions}
                            disabled={isAdded || isAdding}
                            className="font-mono shrink-0"
                        >
                            {isAdded ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Added
                                </>
                            ) : isAdding ? (
                                'Adding...'
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add to Queue
                                </>
                            )}
                        </Button>
                    </div>
                </section>
            )}
        </article>
    );
}

function MarkdownContent({ content }: { content: string }) {
    // Simple markdown-like rendering for MVP
    // In production, use a proper MDX parser

    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let codeLanguage = '';
    let key = 0;

    for (const line of lines) {
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                elements.push(
                    <pre key={key++} className="bg-secondary border-2 border-border p-4 overflow-x-auto">
                        <code className="font-mono text-sm">{codeContent.join('\n')}</code>
                    </pre>
                );
                codeContent = [];
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
                codeLanguage = line.slice(3);
            }
            continue;
        }

        if (inCodeBlock) {
            codeContent.push(line);
            continue;
        }

        // Headers
        if (line.startsWith('## ')) {
            elements.push(
                <h2 key={key++} className="text-2xl font-bold font-sans mt-8 mb-4">
                    {line.slice(3)}
                </h2>
            );
            continue;
        }

        if (line.startsWith('### ')) {
            elements.push(
                <h3 key={key++} className="text-xl font-bold font-sans mt-6 mb-3">
                    {line.slice(4)}
                </h3>
            );
            continue;
        }

        if (line.startsWith('# ')) {
            elements.push(
                <h2 key={key++} className="text-2xl font-bold font-sans mt-8 mb-4">
                    {line.slice(2)}
                </h2>
            );
            continue;
        }

        // List items
        if (line.startsWith('- ')) {
            elements.push(
                <li key={key++} className="font-serif ml-4">
                    {renderInlineCode(line.slice(2))}
                </li>
            );
            continue;
        }

        // Numbered list
        if (/^\d+\.\s/.test(line)) {
            const content = line.replace(/^\d+\.\s/, '');
            elements.push(
                <li key={key++} className="font-serif ml-4 list-decimal">
                    {renderInlineCode(content)}
                </li>
            );
            continue;
        }

        // Paragraph
        if (line.trim()) {
            elements.push(
                <p key={key++} className="font-serif text-lg leading-relaxed mb-4">
                    {renderInlineCode(line)}
                </p>
            );
        }
    }

    return <div className="space-y-1">{elements}</div>;
}

function renderInlineCode(text: string): React.ReactNode {
    const parts = text.split(/(`[^`]+`)/);
    return parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
            return (
                <code key={i} className="font-mono text-sm bg-secondary px-1.5 py-0.5 border border-border">
                    {part.slice(1, -1)}
                </code>
            );
        }
        // Handle bold
        const boldParts = part.split(/(\*\*[^*]+\*\*)/);
        return boldParts.map((bp, j) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
                return <strong key={`${i}-${j}`}>{bp.slice(2, -2)}</strong>;
            }
            return bp;
        });
    });
}
