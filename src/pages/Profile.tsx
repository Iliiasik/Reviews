import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { useLocation, useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (location.state?.loginSuccess) {
            setShowToast(true);
        }
    }, [location.state]);

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (err) {
            console.error('Ошибка при выходе:', err);
        } finally {
            navigate('/login');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
            <Navbar />

            {showToast && (
                <Toast
                    message="Успешный вход!"
                    type="success"
                    duration={3000}
                    onClose={() => setShowToast(false)}
                />
            )}

            <main className="flex-grow flex items-center justify-center p-6">
                <div className="card w-full max-w-3xl bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title justify-center text-3xl font-bold mb-4">Профиль</h2>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="avatar">
                                <div className="w-32 rounded-full overflow-hidden">
                                    <img
                                        src="https://api.dicebear.com/7.x/initials/svg?seed=user"
                                        alt="Аватар"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 space-y-3 text-lg">
                                <div>
                                    <span className="font-semibold">ФИО:</span> Текст
                                </div>
                                <div>
                                    <span className="font-semibold">Логин:</span> Текст
                                </div>
                                <div>
                                    <span className="font-semibold">Роль:</span> Текст
                                </div>
                                <div>
                                    <span className="font-semibold">Email:</span> Текст
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <button className="btn btn-outline btn-warning">Сменить пароль</button>
                            <button className="btn btn-error text-white" onClick={handleLogout}>
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
