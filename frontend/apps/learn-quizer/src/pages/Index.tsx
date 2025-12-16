import { PostList } from '@/components/blog/PostList';
import { Layout } from '@/components/layout/Layout';
import { getAllPosts } from '@/data/posts';

const Index = () => {
    const posts = getAllPosts();

    return (
        <Layout>
            <div className="space-y-8">
                <section>
                    <h2 className="sr-only">Recent Posts</h2>
                    <PostList posts={posts} />
                </section>
            </div>
        </Layout>
    );
};

export default Index;
