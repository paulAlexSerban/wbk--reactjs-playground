export type AuthContextState = {
    isLoggedIn: boolean;
};

export type AuthContextHandlers = {
    onLogout: () => void;
    onLogin: (email: string, password: string) => void;
};

export type AuthContextType = AuthContextState & AuthContextHandlers;
