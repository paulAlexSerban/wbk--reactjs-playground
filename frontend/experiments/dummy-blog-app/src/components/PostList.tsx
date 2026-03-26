import { Link } from 'react-router-dom';
import classes from './PostList.module.css';
import { Post } from './PostItem';

export type Posts = Post[];

function PostList({ posts }: { posts: Posts }) {
    return (
        <ul className={classes.list}>
            {posts.map((post) => (
                <li key={post.id}>
                    <Link to={post.id.toString()}>{post.title}</Link>
                </li>
            ))}
        </ul>
    );
}

export default PostList;
