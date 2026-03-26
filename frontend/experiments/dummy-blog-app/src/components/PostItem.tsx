import classes from './PostItem.module.css';

export type Post = {
    id: number;
    title: string;
    body: string;
};

function PostItem({ post }: { post: Post }) {
    return (
        <article className={classes.item}>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
        </article>
    );
}

export default PostItem;
