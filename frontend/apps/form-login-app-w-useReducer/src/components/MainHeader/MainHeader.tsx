import { type FC } from 'react';

import Navigation from './Navigation';
import classes from './MainHeader.module.scss';

// type MainHeaderProps = {
//     isAuthenticated: boolean;
//     onLogout: () => void;
// };

const MainHeader: FC = () => {
    return (
        <header className={classes['main-header']}>
            <h1>A Typical Page</h1>
            <Navigation />
        </header>
    );
};

export default MainHeader;
