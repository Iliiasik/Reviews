import { forwardRef } from 'react';
import  UserInfo  from './UserInfo';
import  SpecialistInfo  from './SpecialistInfo.tsx';
import  OrganizationInfo  from './OrganizationInfo';

interface ProfileTabProps {
    profile: any;
    isLoading: boolean;
    onEdit: () => void;
    onChangePassword: () => void;
    onLogout: () => void;
}

export const ProfileTab = forwardRef<HTMLDivElement, ProfileTabProps>(({
                                                                           profile,
                                                                           isLoading,
                                                                           onEdit,
                                                                           onChangePassword,
                                                                           onLogout,
                                                                       }, ref) => {
    if (isLoading) {
        return (
            <div className="p-8 flex justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-8 text-center">
                <p>Не удалось загрузить данные профиля</p>
            </div>
        );
    }

    return (
        <div ref={ref}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Основная информация</h2>
                    <button
                        className="btn btn-sm btn-ghost text-primary"
                        onClick={onEdit}
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
                                    is_confirmed={profile.is_confirmed}
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
                                    is_confirmed={profile.is_confirmed}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 py-4 bg-base-300/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="font-medium">Управление аккаунтом</h3>
                    <p className="text-sm text-gray-600">Смена пароля, выход из системы</p>
                </div>
                <div className="flex gap-3">
                    <button
                        className="btn btn-sm btn-ghost text-warning"
                        onClick={onChangePassword}
                    >
                        Сменить пароль
                    </button>
                    <button
                        className="btn btn-sm btn-ghost text-error"
                        onClick={onLogout}
                    >
                        Выйти
                    </button>
                </div>
            </div>
        </div>
    );
});