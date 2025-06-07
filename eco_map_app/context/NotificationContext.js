import React, { createContext, useState, useCallback } from 'react';
import TopNotification from '../components/TopNotification'; 

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState({
        visible: false,
        message: '',
        type: 'success',
    });

    const showNotification = useCallback((type, message) => {
        setNotification({ visible: true, type, message });
    }, []);

    const handleDismissNotification = useCallback(() => {
        setNotification((prev) => ({ ...prev, visible: false }));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            <TopNotification
                visible={notification.visible}
                message={notification.message}
                type={notification.type}
                onDismiss={handleDismissNotification}
            />
            {children}
        </NotificationContext.Provider>
    );
}