import {createContext, useContext, useState, type ReactNode} from 'react';
import Toast from '@shared/ui/Toast.tsx';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<{
        message: string;
        type: ToastType;
        duration: number;
        key: number;
    } | null>(null);

    const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
        setToast({ message, type, duration, key: Date.now() });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Toast
                    key={toast.key}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => setToast(null)}
                />
            )}
        </ToastContext.Provider>
    );
};
