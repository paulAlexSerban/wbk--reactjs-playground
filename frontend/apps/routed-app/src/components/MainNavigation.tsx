import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './MainNavigation.module.scss';

const MainNavigation: FC = () => {
    return (
        <header className={styles.header}>
            <nav>
                <ul className={styles.list}>
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => {
                                return isActive ? styles.active : '';
                            }}
                            end
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/products"
                            className={({ isActive }) => {
                                return isActive ? styles.active : '';
                            }}
                        >
                            Products
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default MainNavigation;
