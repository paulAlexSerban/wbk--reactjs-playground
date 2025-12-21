import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import HomePage from './pages/Home';
import RootLayout from './pages/Root';

const BlogPage = lazy(() => import('./pages/Blog'));
const PostPage = lazy(() => import('./pages/Post'));

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'posts',
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<h1>Loading...</h1>}>
                                <BlogPage />
                            </Suspense>
                        ),
                        loader: () => import('./pages/Blog').then((mod) => mod.loader()),
                    },
                    {
                        path: ':id',
                        element: (
                            <Suspense fallback={<h1>Loading...</h1>}>
                                <PostPage />
                            </Suspense>
                        ),
                        loader: async ({ params }) => {
                            const { id } = params;
                            if (typeof id === 'string') {
                                return import('./pages/Post').then((mod) => mod.loader({ params: { id } }));
                            } else {
                                throw new Error('Post ID is required and must be a string');
                            }
                        },
                    },
                ],
            },
        ],
    },
    // Fallback route
    { path: '*', element: <Navigate to="/" replace /> },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
