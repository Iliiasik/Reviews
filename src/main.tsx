import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { UserProvider } from '@shared/context/UserContext.tsx';
import { ToastProvider } from '@shared/context/ToastContext';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <UserProvider>
            <ToastProvider>
                <App />
            </ToastProvider>
        </UserProvider>
    </StrictMode>
);
