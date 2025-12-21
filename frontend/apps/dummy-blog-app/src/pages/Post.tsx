import { useLoaderData } from 'react-router-dom';

import PostItem, { Post } from '../components/PostItem';

function PostPage() {
    const post = useLoaderData() as Post;

    return <PostItem post={post} />;
}

export default PostPage;

export function loader({ params }: { params: { id: string } }) {
    const postId = params.id;
    return fetch('https://jsonplaceholder.typicode.com/posts/' + postId);
}
