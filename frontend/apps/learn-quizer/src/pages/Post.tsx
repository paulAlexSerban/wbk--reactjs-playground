import { useParams, Navigate } from 'react-router-dom';
import { BlogPost } from '@/components/blog/BlogPost';
import { Layout } from '@/components/layout/Layout';
import { getPostBySlug } from '@/data/posts';

const Post = () => {
    const { slug } = useParams<{ slug: string }>();
    const post = slug ? getPostBySlug(slug) : undefined;

    if (!post) {
        return <Navigate to="/" replace />;
    }

    return (
        <Layout>
            <BlogPost post={post} />
        </Layout>
    );
};

export default Post;
