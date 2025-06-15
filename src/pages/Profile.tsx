import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { useLocation, useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    const [profile, setProfile] = useState<{
        name: string;
        email: string;
        username: string;
        role: string;
        experience_years?: number;
        about?: string;
        website?: string;
        address?: string;
    } | null>(null);

    useEffect(() => {
        if (location.state?.loginSuccess) {
            setShowToast(true);
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/profile", { credentials: "include" });
                const data = await res.json();
                if (!res.ok) {
                    console.error(data.error);
                    navigate("/login");
                    return;
                }
                setProfile(data);
            } catch (e) {
                console.error("Ошибка загрузки профиля:", e);
            }
        };

        fetchProfile();
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
                        <h2 className="card-title justify-center text-3xl font-bold mb-4">
                            {profile?.role === 'specialist' && 'Профиль специалиста'}
                            {profile?.role === 'organization' && 'Организация'}
                            {profile?.role === 'user' && 'Профиль пользователя'}
                            {!profile && 'Профиль'}
                        </h2>


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
                                <div><span className="font-semibold">ФИО:</span> {profile?.name ?? '...'}</div>
                                <div><span className="font-semibold">Логин:</span> {profile?.username ?? '...'}</div>
                                <div><span className="font-semibold">Роль:</span> {profile?.role ?? '...'}</div>
                                <div><span className="font-semibold">Email:</span> {profile?.email ?? '...'}</div>

                                {profile?.role === 'specialist' && (
                                    <>
                                        <div><span className="font-semibold">Опыт:</span> {profile.experience_years ?? '-'} лет</div>
                                        <div><span className="font-semibold">О себе:</span> {profile.about ?? '-'}</div>
                                    </>
                                )}

                                {profile?.role === 'organization' && (
                                    <>
                                        <div><span className="font-semibold">Сайт:</span> {profile.website ?? '-'}</div>
                                        <div><span className="font-semibold">Адрес:</span> {profile.address ?? '-'}</div>
                                        <div><span className="font-semibold">О нас:</span> {profile.about ?? '-'}</div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <button className="btn btn-outline btn-warning">Сменить пароль</button>
                            <button className="btn btn-error text-white" onClick={handleLogout}>Выйти</button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
