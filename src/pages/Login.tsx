import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                navigate('/profile', { state: { loginSuccess: true } });
            } else {
                const data = await response.json();
                setError(data.error || 'Ошибка при входе');
            }
        } catch {
            setError('Ошибка сети');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
            <Navbar />
            <main className="flex-grow flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-md shadow-lg rounded-box bg-base-200 p-8 relative">
                    <h1 className="text-3xl font-bold mb-6 text-center">
                        Вход в систему
                    </h1>

                    {loading && (
                        <div className="flex justify-center mb-4">
                            <span className="loading loading-spinner text-primary scale-125"></span>
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                        <label className="form-control w-full">
                            <div className="label m-2">
                                <span className="label-text">Логин</span>
                            </div>
                            <input
                                type="text"
                                name="username"
                                placeholder="Введите логин"
                                className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </label>

                        <label className="form-control w-full">
                            <div className="label m-2">
                                <span className="label-text">Пароль</span>
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Введите пароль"
                                className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </label>

                        {error && (
                            <div className="text-error text-sm mt-2 text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-full mt-4"
                            disabled={loading}
                        >
                            {loading ? 'Входим...' : 'Войти'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span>Ещё нет аккаунта?</span>{' '}
                        <Link to="/register" className="link link-primary">
                            Зарегистрируйтесь
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
