import React, { useEffect, useState } from 'react';
import Navbar from '@components/general/Navbar.tsx';
import Footer from '@components/general/Footer.tsx';
import Toast from '@components/general/Toast.tsx';
import ChangePasswordModal from '@components/Profile/ChangePasswordModal.tsx';
import EditProfileModal from '@components/Profile/EditProfileModal.tsx';
import { useLocation, useNavigate } from 'react-router-dom';

import UserInfo from '@components/Profile/UserInfo.tsx';
import SpecialistInfo from '@components/Profile/SpecialistInfo.tsx';
import OrganizationInfo from '@components/Profile/OrganizationInfo.tsx';

const Profile: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [profile, setProfile] = useState<{
        name: string;
        email: string;
        username: string;
        phone?: string;
        role: string;
        experience_years?: number;
        about?: string;
        website?: string;
        address?: string;
    } | null>(null);

    useEffect(() => {
        if (location.state?.loginSuccess) {
            setToastMessage('Успешный вход!');
            setShowToast(true);
            navigate(location.pathname, { replace: true, state: {} });
        } else if (location.state?.alreadyLoggedIn) {
            setToastMessage('Вы уже вошли в систему');
            setShowToast(true);
            navigate(location.pathname, { replace: true, state: {} });
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
    }, [location, navigate]);

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

    const handleProfileUpdate = async () => {
        try {
            const res = await fetch("/api/profile", { credentials: "include" });
            const data = await res.json();
            if (res.ok) {
                setProfile(data);
                setToastMessage('Профиль успешно обновлён');
                setShowToast(true);
            }
        } catch (err) {
            console.error('Ошибка при обновлении профиля:', err);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
            <Navbar />

            {showToast && (
                <Toast
                    message={toastMessage}
                    type="success"
                    duration={3000}
                    onClose={() => setShowToast(false)}
                />
            )}

            {showChangePassword && (
                <ChangePasswordModal
                    onClose={() => setShowChangePassword(false)}
                    onSuccess={() => {
                        setToastMessage('Пароль успешно изменён');
                        setShowToast(true);
                    }}
                />
            )}

            {showEditModal && profile && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleProfileUpdate}
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
                                {profile?.role === 'user' && (
                                    <UserInfo
                                        name={profile.name}
                                        username={profile.username}
                                        email={profile.email}
                                        phone={profile.phone}
                                    />
                                )}

                                {profile?.role === 'specialist' && (
                                    <>
                                        <UserInfo
                                            name={profile.name}
                                            username={profile.username}
                                            email={profile.email}
                                            phone={profile.phone}
                                        />
                                        <SpecialistInfo
                                            experience_years={profile.experience_years}
                                            about={profile.about}
                                            phone={profile.phone}
                                        />
                                    </>
                                )}

                                {profile?.role === 'organization' && (
                                    <>
                                        <div><span className="font-semibold">Название:</span> {profile.name}</div>
                                        <OrganizationInfo
                                            website={profile.website}
                                            address={profile.address}
                                            about={profile.about}
                                            phone={profile.phone}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-4 flex-wrap">
                            <button
                                className="btn btn-outline btn-info"
                                onClick={() => setShowEditModal(true)}
                            >
                                Редактировать
                            </button>
                            <button
                                className="btn btn-outline btn-warning"
                                onClick={() => setShowChangePassword(true)}
                            >
                                Сменить пароль
                            </button>
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
