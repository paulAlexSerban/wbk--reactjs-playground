import { type FC } from 'react';

import classes from './Navigation.module.scss';
import { useAuthContext } from '../../store/auth-context';

// type NavigationProps = {
//     isLoggedIn: boolean;
//     onLogout: () => void;
// };

const Navigation: FC = () => {
    const { isLoggedIn, onLogout } = useAuthContext();

    return (
        <nav className={classes.nav}>
            <ul>
                {isLoggedIn && (
                    <li>
                        <a href="/">Users</a>
                    </li>
                )}
                {isLoggedIn && (
                    <li>
                        <a href="/">Admin</a>
                    </li>
                )}
                {isLoggedIn && (
                    <li>
                        <button onClick={onLogout}>Logout</button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navigation;
