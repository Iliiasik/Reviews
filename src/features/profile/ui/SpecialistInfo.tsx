import { FiAward, FiInfo } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { RequestVerificationButton } from './RequestVerificationButton';

interface SpecialistInfoProps {
    experience_years?: number;
    about?: string;
    is_confirmed?: boolean;
}

const InfoItem = ({ icon: Icon, label, value }: { icon: IconType, label: string, value: React.ReactNode }) => (
    <div className="flex items-start gap-3 py-2">
        <Icon className="flex-shrink-0 mt-1 text-base-content/70" />
        <div>
            <div className="text-sm font-medium text-base-content/70">{label}</div>
            <div className="mt-1">{value || '-'}</div>
        </div>
    </div>
);

export const SpecialistInfo = ({ experience_years, about, is_confirmed }: SpecialistInfoProps) => (
    <div className="space-y-3">
        <InfoItem
            icon={FiAward}
            label="Опыт работы"
            value={
                experience_years
                    ? `${experience_years} ${experience_years === 1
                        ? 'год'
                        : experience_years < 5
                            ? 'года'
                            : 'лет'}`
                    : null
            }
        />
        <InfoItem icon={FiInfo} label="О себе" value={about} />

        <RequestVerificationButton
            userType="specialist"
            isConfirmed={is_confirmed || false}
        />
    </div>
);
export default SpecialistInfo;
