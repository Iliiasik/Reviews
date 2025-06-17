import { FiUser, FiMail, FiPhone } from 'react-icons/fi';
import type { IconType } from 'react-icons';

interface UserInfoProps {
    name: string;
    username: string;
    email: string;
    phone?: string;
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

const UserInfo = ({ name, email, phone }: UserInfoProps) => (
    <div className="space-y-3">
        <InfoItem icon={FiUser} label="ФИО" value={name} />
        <InfoItem icon={FiMail} label="Email" value={email} />
        <InfoItem icon={FiPhone} label="Телефон" value={phone} />
    </div>
);

export default UserInfo;
