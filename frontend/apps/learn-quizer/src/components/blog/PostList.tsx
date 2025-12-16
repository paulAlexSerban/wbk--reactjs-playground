import { Link } from 'react-router-dom';
import type { BlogPost } from '@/types/quiz';
import { cn } from '@/lib/utils';

interface PostListProps {
    posts: BlogPost[];
}

export function PostList({ posts }: PostListProps) {
    return (
        <div className="space-y-6">
            {posts.map((post, index) => (
                <article
                    key={post.slug}
                    className={cn('group border-2 border-border p-6', 'hover:shadow-md transition-shadow', 'bg-card')}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-2 py-1 text-xs font-mono bg-secondary border border-border">
                            {post.subject}
                        </span>
                        <time className="text-xs font-mono text-muted-foreground">
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </time>
                    </div>

                    <Link to={`/post/${post.slug}`}>
                        <h2 className="text-xl font-bold font-sans mb-2 group-hover:underline underline-offset-4">
                            {post.title}
                        </h2>
                    </Link>

                    <p className="text-muted-foreground font-serif mb-4">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 4).map((tag) => (
                                <span key={tag} className="text-xs font-mono text-muted-foreground">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {post.questions.length > 0 && (
                            <span className="text-xs font-mono text-muted-foreground">
                                {post.questions.length} quiz question{post.questions.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </article>
            ))}
        </div>
    );
}
