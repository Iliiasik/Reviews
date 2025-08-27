import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

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
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
            <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-base-300">
                <div className="card-body items-center text-center space-y-4">
                    {status === 'loading' && (
                        <>
                            <ClockIcon className="w-12 h-12 text-warning animate-spin" />
                            <h2 className="text-xl font-semibold">Подтверждение email...</h2>
                            <p className="text-base-content text-sm">Пожалуйста, подождите, мы проверяем ссылку.</p>
                        </>
                    )}
                    {status === 'success' && (
                        <>
                            <CheckCircleIcon className="w-12 h-12 text-success" />
                            <h2 className="text-xl font-semibold text-success">Email подтверждён</h2>
                            <p className="text-base-content text-sm">Вы будете перенаправлены на страницу входа через несколько секунд.</p>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <XCircleIcon className="w-12 h-12 text-error" />
                            <h2 className="text-xl font-semibold text-error">Ошибка подтверждения</h2>
                            <p className="text-base-content text-sm">Ссылка недействительна или устарела. Попробуйте запросить новую.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmEmail;
