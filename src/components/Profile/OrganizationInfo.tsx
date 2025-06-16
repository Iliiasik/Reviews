import { FiGlobe, FiMapPin, FiInfo } from 'react-icons/fi';
import type { IconType } from 'react-icons';

interface OrganizationInfoProps {
    website?: string;
    address?: string;
    about?: string;
}

const InfoItem = ({ icon: Icon, label, value }: { icon: IconType; label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-3 py-2">
        <Icon className="flex-shrink-0 mt-1 text-base-content/70" />
        <div>
            <div className="text-sm font-medium text-base-content/70">{label}</div>
            <div className="mt-1">{value || '-'}</div>
        </div>
    </div>
);

const OrganizationInfo = ({ website, address, about }: OrganizationInfoProps) => (
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
                        className="link link-primary"
                    >
                        {website}
                    </a>
                }
            />
        )}
        <InfoItem icon={FiMapPin} label="Адрес" value={address} />
        <InfoItem icon={FiInfo} label="О нас" value={about} />
    </div>
);

export default OrganizationInfo;
