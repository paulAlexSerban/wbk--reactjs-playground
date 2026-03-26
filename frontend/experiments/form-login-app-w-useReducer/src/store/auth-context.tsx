import { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { AuthContextType } from './auth-context.types';

export const AuthContext = createContext<AuthContextType | null>({
    isLoggedIn: false,
    onLogout: () => {},
    onLogin: () => {},
});

// useAuthContext is a custom hook, which is a function that uses other hooks
// this obeys the rules of hooks, which are:
// 1. only call hooks at the top level
// 2. only call hooks from React functions

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within a AuthContextProvider');
    }
    return context;
};

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const loginHandler = () => {
        // We should of course check email and password
        // But it's just a dummy/ demo anyways
        localStorage.setItem('isLoggedIn', '1');
        setIsLoggedIn(true);
    };

    const logoutHandler = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    };

    useEffect(() => {
        // this code could be performance intensive, so it should be not run on every render cycle, but only once
        const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');
        if (storedUserLoggedInInformation === '1') {
            setIsLoggedIn(true);
        }
    }, []);

    const ctxValue = {
        isLoggedIn: isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler,
    };

    return <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
