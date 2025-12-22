import './styles/index.css';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Profile from './routes/ProfilePage';
import Learn from './routes/LearnPage';
import Settings from './routes/SettingsPage';
import ErrorPage from './components/ErrorPage';
import Lesson from './routes/LessonPage';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const container = document.getElementById('root');
if (!container) {
    throw new Error('Failed to find the root element');
}
const root = ReactDOM.createRoot(container);

const DOMAIN_PATH = import.meta.env.VITE_DOMAIN_PATH;

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <App />,
            errorElement: <ErrorPage />,
            children: [
                {
                    errorElement: <ErrorPage />,
                    children: [
                        {
                            index: true,
                            element: <Learn />,
                        },
                        {
                            path: '/unit/:unitId/lesson/:lessonId',
                            element: <Lesson />,
                        },
                        {
                            path: '/profile',
                            element: <Profile />,
                        },
                        {
                            path: '/settings',
                            element: <Settings />,
                        },
                    ],
                },
            ],
        },
    ],
    { basename: DOMAIN_PATH }
);

root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
