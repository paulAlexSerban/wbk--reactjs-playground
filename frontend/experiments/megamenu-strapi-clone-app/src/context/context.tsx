import { createContext, useContext, useState, ReactNode } from 'react';

export type AppContextValue = {
    isSidebarOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
    pageId: string | null;
    setPageId: (pageId: string | null) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [pageId, setPageId] = useState<string | null>(null);

    const openSidebar = () => {
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <AppContext.Provider
            value={{
                isSidebarOpen,
                openSidebar,
                closeSidebar,
                pageId,
                setPageId,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

/**
 * useGlobalContext is a custom hook that can be used to access the AppContext
 * from any component that is a child of the AppProvider
 * This way, we don't have to use useContext(AppContext) in every component that needs access to the AppContext
 */

export const useGlobalContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a AppProvider');
    }
    return context;
};
