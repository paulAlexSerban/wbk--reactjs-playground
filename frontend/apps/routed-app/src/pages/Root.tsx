import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation';

const RootLayout: FC = () => {
    return (
        <>
            <MainNavigation />
            <main>
                {/* Outlet marks the place where the child component should be rendered to */}
                <Outlet />
            </main>
        </>
    );
};

export default RootLayout;
