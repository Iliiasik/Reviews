import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose: () => void;
}

const icons = {
    success: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    error: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    info: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
        </svg>
    ),
    warning: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0zM12 9v4m0 4h.01" />
        </svg>
    ),
};

const colorVariants = {
    success: 'bg-green-100 text-green-900 border-none',
    error: 'bg-red-100 text-red-900 border-none',
    info: 'bg-blue-100 text-blue-900 border-none',
    warning: 'bg-yellow-100 text-yellow-900 border-none',
};

const Toast: React.FC<ToastProps> = ({
                                         message,
                                         type = 'info',
                                         duration = 3000,
                                         onClose,
                                     }) => {
    const [visible, setVisible] = useState(true);
    const style = colorVariants[type];

    useEffect(() => {
        const hideTimer = setTimeout(() => {
            setVisible(false); // запускаем анимацию скрытия
        }, duration);

        return () => clearTimeout(hideTimer);
    }, [duration]);

    // после завершения анимации — вызов onClose
    useEffect(() => {
        if (!visible) {
            const timeout = setTimeout(onClose, 300); // длительность CSS transition
            return () => clearTimeout(timeout);
        }
    }, [visible, onClose]);

    return (
        <div className="toast toast-bottom toast-center z-50">
            <div
                role="alert"
                className={`
                    alert alert-${type} shadow-lg border-2 ${style}
                    transform transition-all duration-300 ease-in-out
                    ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                `}
            >
                {icons[type]}
                <span className="font-semibold">{message}</span>
            </div>
        </div>
    );
};

export default Toast;
