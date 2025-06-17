import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import Navbar from '@shared/ui/Navbar.tsx';
import Footer from '@shared/ui/Footer.tsx';
import Toast from '@shared/ui/Toast.tsx';
import ChangePasswordModal from '@components/Profile/ChangePasswordModal';
import EditProfileModal from '@components/Profile/EditProfileModal';
import { useLocation, useNavigate } from 'react-router-dom';
import UserInfo from '@components/Profile/UserInfo';
import SpecialistInfo from '@components/Profile/SpecialistInfo';
import OrganizationInfo from '@components/Profile/OrganizationInfo';

interface ProfileData {
    name: string;
    email: string;
    username: string;
    phone?: string;
    role: string;
    experience_years?: number;
    about?: string;
    website?: string;
    address?: string;
}

interface Review {
    id: number;
    author: string;
    rating: number;
    text: string;
    date: string;
}

const Profile: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<ProfileData | null>(null);

    const [userReviews] = useState<Review[]>([
        { id: 1, author: 'Иван Иванов', rating: 5, text: 'Отличный сервис!', date: '2023-05-15' },
        { id: 2, author: 'Петр Петров', rating: 4, text: 'Хорошее качество услуг', date: '2023-04-22' }
    ]);

    const [receivedReviews] = useState<Review[]>([
        { id: 1, author: 'Алексей Смирнов', rating: 5, text: 'Профессионал своего дела!', date: '2023-06-10' }
    ]);

    const profileRef = useRef<HTMLDivElement>(null);
    const reviewsRef = useRef<HTMLDivElement>(null);
    const qrRef = useRef<HTMLDivElement>(null);
    const hasFetchedProfile = useRef(false);

    useEffect(() => {
        if (hasFetchedProfile.current) return;

        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const res = await fetch("/api/profile", { credentials: "include" });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');

                setProfile(data);
                hasFetchedProfile.current = true;

                if (location.state?.loginSuccess) {
                    setToastMessage('Успешный вход!');
                    setShowToast(true);
                } else if (location.state?.alreadyLoggedIn) {
                    setToastMessage('Вы уже вошли в систему');
                    setShowToast(true);
                }

                navigate(location.pathname, { replace: true, state: {} });
            } catch (error) {
                console.error("Ошибка загрузки профиля:", error);
                navigate("/login");
            } finally {
                setIsLoading(false);
                gsap.from(profileRef.current, {
                    opacity: 0, y: 20, duration: 0.5, ease: "power2.out"
                });
            }
        };

        fetchProfile();
    }, [location, navigate]);

    useEffect(() => {
        if (activeTab === 'reviews' && reviewsRef.current) {
            gsap.from(reviewsRef.current, {
                opacity: 0, x: -20, duration: 0.3, ease: "power2.out"
            });
        } else if (activeTab === 'qr' && qrRef.current) {
            gsap.from(qrRef.current, {
                opacity: 0, x: 20, duration: 0.3, ease: "power2.out"
            });
        } else if (profileRef.current) {
            gsap.from(profileRef.current, {
                opacity: 0, y: 20, duration: 0.3, ease: "power2.out"
            });
        }
    }, [activeTab]);

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
            });
            navigate('/login');
        } catch (err) {
            console.error('Ошибка при выходе:', err);
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

    const generateQrCode = async () => {
        try {
            setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=example');
            setToastMessage('QR-код успешно сгенерирован');
            setShowToast(true);
        } catch (err) {
            console.error('Ошибка при генерации QR-кода:', err);
            setToastMessage('Ошибка при генерации QR-кода');
            setShowToast(true);
        }
    };

    const downloadQrCode = () => {
        if (!qrCode) return;
        const link = document.createElement('a');
        link.href = qrCode;
        link.download = 'my-qr-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

            <main className="flex-grow pt-20 pb-12 px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Profile Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                            <div className="avatar">
                                <div className="w-24 md:w-32 rounded-full overflow-hidden ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img
                                        src="https://api.dicebear.com/7.x/initials/svg?seed=user"
                                        alt="Аватар"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    {profile?.name || 'Загрузка...'}
                                </h1>
                                <p className="text-base-content/70">@{profile?.username || 'username'}</p>
                                <div className="badge badge-neutral mt-1">
                                    {profile?.role === 'specialist' && 'Специалист'}
                                    {profile?.role === 'organization' && 'Организация'}
                                    {profile?.role === 'user' && 'Пользователь'}
                                </div>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="border-b border-base-300">
                            <nav className="flex space-x-8">
                                <button
                                    className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-base-content/70 hover:text-base-content hover:border-base-300'}`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    Профиль
                                </button>
                                <button
                                    className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-base-content/70 hover:text-base-content hover:border-base-300'}`}
                                    onClick={() => setActiveTab('reviews')}
                                >
                                    Отзывы
                                </button>
                                {(profile?.role === 'specialist' || profile?.role === 'organization') && (
                                    <button
                                        className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'qr' ? 'border-primary text-primary' : 'border-transparent text-base-content/70 hover:text-base-content hover:border-base-300'}`}
                                        onClick={() => setActiveTab('qr')}
                                    >
                                        QR-код
                                    </button>
                                )}
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-base-200 rounded-lg shadow overflow-hidden">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div ref={profileRef}>
                                {isLoading ? (
                                    <div className="p-8 flex justify-center">
                                        <span className="loading loading-spinner loading-lg"></span>
                                    </div>
                                ) : profile ? (
                                    <>
                                        <div className="p-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <h2 className="text-xl font-semibold">Основная информация</h2>
                                                <button
                                                    className="btn btn-sm btn-ghost text-primary"
                                                    onClick={() => setShowEditModal(true)}
                                                >
                                                    Редактировать
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="card bg-base-100 shadow-sm">
                                                    <div className="card-body">
                                                        <h3 className="card-title">Личные данные</h3>
                                                        <UserInfo
                                                            name={profile.name}
                                                            username={profile.username}
                                                            email={profile.email}
                                                            phone={profile.phone}
                                                        />
                                                    </div>
                                                </div>

                                                {profile.role === 'specialist' && (
                                                    <div className="card bg-base-100 shadow-sm">
                                                        <div className="card-body">
                                                            <h3 className="card-title">Профессиональная информация</h3>
                                                            <SpecialistInfo
                                                                experience_years={profile.experience_years}
                                                                about={profile.about}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {profile.role === 'organization' && (
                                                    <div className="card bg-base-100 shadow-sm">
                                                        <div className="card-body">
                                                            <h3 className="card-title">Информация об организации</h3>
                                                            <OrganizationInfo
                                                                website={profile.website}
                                                                address={profile.address}
                                                                about={profile.about}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="px-6 py-4 bg-base-300/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <h3 className="font-medium">Управление аккаунтом</h3>
                                                <p className="text-sm text-base-content/70">Измените пароль или выйдите из системы</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    className="btn btn-sm btn-ghost text-warning"
                                                    onClick={() => setShowChangePassword(true)}
                                                >
                                                    Сменить пароль
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-ghost text-error"
                                                    onClick={handleLogout}
                                                >
                                                    Выйти
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-8 text-center">
                                        <p>Не удалось загрузить данные профиля</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div ref={reviewsRef} className="divide-y divide-base-300">
                                <div className="px-6 py-5">
                                    <h2 className="text-xl font-semibold mb-6">Отзывы</h2>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">Ваши отзывы</h3>
                                            {userReviews.length > 0 ? (
                                                <div className="space-y-4">
                                                    {userReviews.map(review => (
                                                        <div key={review.id} className="card bg-base-100 shadow-sm">
                                                            <div className="card-body">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h4 className="font-medium">{review.author}</h4>
                                                                        <div className="text-sm text-base-content/70">{review.date}</div>
                                                                    </div>
                                                                    <div className="badge badge-primary gap-1">
                                                                        {review.rating} ★
                                                                    </div>
                                                                </div>
                                                                <p className="mt-2">{review.text}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="alert alert-info bg-base-100 border-base-300">
                                                    <span>Вы еще не оставляли отзывов</span>
                                                </div>
                                            )}
                                        </div>

                                        {(profile?.role === 'specialist' || profile?.role === 'organization') && (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Отзывы о вас</h3>
                                                {receivedReviews.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {receivedReviews.map(review => (
                                                            <div key={review.id} className="card bg-base-100 shadow-sm">
                                                                <div className="card-body">
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <h4 className="font-medium">{review.author}</h4>
                                                                            <div className="text-sm text-base-content/70">{review.date}</div>
                                                                        </div>
                                                                        <div className="badge badge-primary gap-1">
                                                                            {review.rating} ★
                                                                        </div>
                                                                    </div>
                                                                    <p className="mt-2">{review.text}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="alert alert-info bg-base-100 border-base-300">
                                                        <span>Пока нет отзывов о вас</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* QR Code Tab */}
                        {(activeTab === 'qr' && (profile?.role === 'specialist' || profile?.role === 'organization')) && (
                            <div ref={qrRef} className="px-6 py-5">
                                <div className="max-w-md mx-auto">
                                    <h2 className="text-xl font-semibold mb-2">Ваш QR-код</h2>
                                    <p className="text-base-content/70 mb-6">
                                        Этот QR-код можно использовать для быстрого доступа к вашему профилю
                                    </p>

                                    <div className="flex flex-col items-center space-y-6">
                                        {qrCode ? (
                                            <>
                                                <div className="card bg-base-100 shadow-sm">
                                                    <div className="card-body items-center">
                                                        <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={downloadQrCode}
                                                    >
                                                        Скачать
                                                    </button>
                                                    <button
                                                        className="btn btn-outline btn-sm"
                                                        onClick={generateQrCode}
                                                    >
                                                        Обновить
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="card bg-base-100 shadow-sm">
                                                    <div className="card-body items-center justify-center h-64 w-64">
                                                        <span className="text-base-content/70">QR-код не сгенерирован</span>
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={generateQrCode}
                                                >
                                                    Сгенерировать QR-код
                                                </button>
                                            </>
                                        )}

                                        <div className="alert alert-warning bg-base-100 border-warning mt-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <span>Не передавайте QR-код третьим лицам</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;