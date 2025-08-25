import { FiGlobe, FiMapPin, FiInfo } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { RequestVerificationButton } from './RequestVerificationButton';

interface OrganizationInfoProps {
    website?: string;
    address?: string;
    about?: string;
    is_confirmed?: boolean;
}

const InfoItem = ({ icon: Icon, label, value }: { icon: IconType; label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-3 py-2">
        <Icon className="flex-shrink-0 mt-1 text-base-content/70" />
        <div className="min-w-0">
            <div className="text-sm font-medium text-base-content/70">{label}</div>
            <div className="mt-1 break-words whitespace-normal">{value || '-'}</div>
        </div>
    </div>
);

export const OrganizationInfo = ({ website, address, about, is_confirmed }: OrganizationInfoProps) => (
    <div className="space-y-3">
        {website && (
            <InfoItem
                icon={FiGlobe}
                label="Сайт"
                value={
                    <a
                        href={website.startsWith('http') ? website : `https://${website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary break-words whitespace-normal"
                    >
                        {website}
                    </a>
                }
            />
        )}
        <InfoItem icon={FiMapPin} label="Адрес" value={address} />
        <InfoItem icon={FiInfo} label="О нас" value={about} />

        <RequestVerificationButton
            userType="organization"
            isConfirmed={is_confirmed || false}
        />
    </div>
);
export default OrganizationInfo;