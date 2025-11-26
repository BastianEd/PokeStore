import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface NotificationContextType {
    showNotification: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const showNotification = useCallback((msg: string) => {
        setMessage(msg);
        setIsVisible(true);
        
        setTimeout(() => {
            setIsVisible(false);
        }, 3000);
    }, []);

    const closeNotification = () => setIsVisible(false);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            
            <div className={`notification ${isVisible ? "show" : ""}`}>
                <span id="notification-message">{message}</span>
                <button className="notification-close" onClick={closeNotification}>
                    &times;
                </button>
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification debe usarse dentro de un NotificationProvider");
    }
    return context;
}