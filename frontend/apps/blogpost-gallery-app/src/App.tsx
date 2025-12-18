import { useEffect, useState, type ReactNode } from 'react';
import BlogPosts, { type BlogPost } from './components/BlogPosts';
import ErrorMessage from './components/ErrorMessage';
import Spinner from './components/Spinner';
import fetchingImg from './assets/data-fetching.png';
import HttpRequestFacade from './util/HttpRequestFacade'; // Import HttpRequestFacade

type RawDataBlogPost = {
    id: number;
    userId: number;
    title: string;
    body: string;
};

const POST_LIST_URL = 'https://jsonplaceholder.typicode.com/posts';
const api = new HttpRequestFacade(); // Create an instance of HttpRequestFacade

function App() {
    const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsFetching(true);
            try {
                const rawData: RawDataBlogPost[] = await api.get(POST_LIST_URL); // Use the facade's get method
                const blogPosts: BlogPost[] = rawData.map((post) => ({
                    id: post.id,
                    title: post.title,
                    text: post.body,
                }));
                setFetchedPosts(blogPosts);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setIsFetching(false);
            }
        };

        fetchPosts();
    }, []);

    let content: ReactNode;
    if (error) {
        content = <ErrorMessage text={error} />;
    } else if (isFetching) {
        content = <Spinner />;
    } else if (fetchedPosts.length > 0) {
        content = <BlogPosts posts={fetchedPosts} />;
    } else {
        content = <p>No blog posts found.</p>;
    }

    return (
        <main aria-busy={isFetching}>
            <img src={fetchingImg} alt="Fetching data" />
            {content}
        </main>
    );
}

export default App;
