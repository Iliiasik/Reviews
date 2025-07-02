// features/organization/ui/OrganizationProfileView.tsx
import type { OrganizationProfile } from '../types/OrganizationProfile';

interface Props {
    data: OrganizationProfile;
}

export const OrganizationProfileView = ({ data }: Props) => (
    <div className="w-full max-w-3xl">
        <div className="flex items-center gap-6 mb-6">
            <img
                src={data.avatar_url || "https://api.dicebear.com/7.x/initials/svg?seed=org"}
                alt={data.name}
                className="w-36 h-36 rounded-xl object-cover border"
            />

            <div>
                <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
                    {data.name}
                    {data.is_confirmed && (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="..." clipRule="evenodd" />
                        </svg>
                    )}
                </h1>

                <p className="text-gray-600">Рейтинг: {data.rating.toFixed(1)}</p>
                {data.website && <p className="text-gray-600">Сайт: <a href={data.website} className="link">{data.website}</a></p>}
                {data.address && <p className="text-gray-600">Адрес: {data.address}</p>}
            </div>
        </div>

        <div className="mb-4">
            <h2 className="font-semibold text-lg mb-1">О компании</h2>
            <p>{data.about || 'Нет описания'}</p>
        </div>
    </div>
);
