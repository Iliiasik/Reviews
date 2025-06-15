import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ConfirmEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            return;
        }

        fetch(`/api/confirm-email?token=${token}`)
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(() => {
                setStatus('success');
                setTimeout(() => navigate('/login'), 3000);
            })
            .catch(() => setStatus('error'));
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-100 text-center px-4">
            <div className="max-w-md">
                {status === 'loading' && <p className="text-lg">Подтверждение email...</p>}
                {status === 'success' && (
                    <div className="alert alert-success shadow-lg mt-4">
                        <span>Email успешно подтверждён! Перенаправляем...</span>
                    </div>
                )}
                {status === 'error' && (
                    <div className="alert alert-error shadow-lg mt-4">
                        <span>Ошибка подтверждения. Ссылка недействительна или устарела.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmEmail;
