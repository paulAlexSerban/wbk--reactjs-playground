import { createContext, useState, useContext, ReactNode } from 'react';

export type AppContextValue = {
    isSidebarOpen: boolean;
    isModalOpen: boolean;
    openModal: () => void;
    openSidebar: () => void;
    closeModal: () => void;
    closeSidebar: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openSidebar = () => {
        setIsSidebarOpen(true);
    };
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <AppContext.Provider
            value={{
                isSidebarOpen,
                isModalOpen,
                openModal,
                openSidebar,
                closeModal,
                closeSidebar,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a AppProvider');
    }
    return context;
};
