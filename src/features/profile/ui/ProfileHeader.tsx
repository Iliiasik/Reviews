interface ProfileHeaderProps {
    profile: any;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const ProfileHeader = ({ profile, activeTab, onTabChange }: ProfileHeaderProps) => (
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

        <div className="border-b border-base-300">
            <nav className="flex space-x-8">
                <button
                    className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-base-content/70 hover:text-base-content hover:border-base-300'}`}
                    onClick={() => onTabChange('profile')}
                >
                    Профиль
                </button>
                <button
                    className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-base-content/70 hover:text-base-content hover:border-base-300'}`}
                    onClick={() => onTabChange('reviews')}
                >
                    Отзывы
                </button>
                {(profile?.role === 'specialist' || profile?.role === 'organization') && (
                    <button
                        className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'qr' ? 'border-primary text-primary' : 'border-transparent text-base-content/70 hover:text-base-content hover:border-base-300'}`}
                        onClick={() => onTabChange('qr')}
                    >
                        QR-код
                    </button>
                )}
            </nav>
        </div>
    </div>
);