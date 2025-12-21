import { useLoaderData } from 'react-router-dom';

import PostList from '../components/PostList';
import { Posts } from '../components/PostList';

function BlogPage() {
    const posts = useLoaderData() as Posts;
    return <PostList posts={posts} />;
}

export default BlogPage;

export function loader() {
    return fetch('https://jsonplaceholder.typicode.com/posts');
}
