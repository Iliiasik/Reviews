import { forwardRef, useState } from 'react';
import { FiMail, FiPhone, FiCalendar, FiFileText, FiChevronDown } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import type { VerificationRequest } from '../types/verifications';

interface VerificationsTabProps {
    requests: VerificationRequest[];
    loading: boolean;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}

const InfoItem = ({ icon: Icon, value }: { icon: IconType; value: React.ReactNode }) => (
    <div className="flex items-center gap-2 py-1">
        <Icon className="flex-shrink-0 text-base-content/70" size={16} />
        <span className="text-sm">{value || '-'}</span>
    </div>
);

export const VerificationsTab = forwardRef<HTMLDivElement, VerificationsTabProps>(
    ({ requests, loading, onApprove, onReject }, ref) => {
        if (loading) {
            return (
                <div ref={ref} className="p-8 flex justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            );
        }

        return (
            <div ref={ref} className="p-6">
                <h2 className="text-xl font-semibold mb-6">Заявки на подтверждение</h2>

                {requests.length === 0 ? (
                    <div className="card bg-base-100 shadow-sm">
                        <div className="card-body">
                            <p className="text-center py-8 text-base-content/70">Нет активных заявок</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {requests.map((request) => {
                            const [isExpanded, setIsExpanded] = useState(false);

                            return (
                                <div key={request.id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                                    <figure className="px-0 h-64">
                                        <img
                                            src={request.user.avatar_url || "https://i.pinimg.com/736x/c8/37/0d/c8370dd7bd7c2ae6f52db1ac007fe1c0.jpg"}
                                            alt={`Аватар ${request.user.name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </figure>
                                    <div className="card-body p-6 flex flex-col flex-grow">
                                        <div className="space-y-3">
                                            <h2 className="card-title justify-between">
                                                <span className="truncate max-w-[180px]">{request.user.name}</span>
                                                <div className="badge badge-neutral">
                                                    {request.user.role.name === 'specialist' && 'Специалист'}
                                                    {request.user.role.name === 'organization' && 'Организация'}
                                                    {request.user.role.name === 'user' && 'Пользователь'}
                                                    {request.user.role.name === 'admin' && 'Администратор'}
                                                </div>
                                            </h2>

                                            <div className="space-y-2">
                                                <InfoItem icon={FiMail} value={<span className="truncate">{request.user.email}</span>} />
                                                <InfoItem icon={FiPhone} value={request.user.phone} />

                                                <div className="flex items-start gap-2 pt-1">
                                                    <FiFileText className="flex-shrink-0 text-base-content/70 mt-0.5" size={16} />
                                                    <button
                                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                                        onClick={() => setIsExpanded((prev) => !prev)}
                                                    >
                                                        {isExpanded ? 'Скрыть' : 'Подробнее'}
                                                        <FiChevronDown size={14} className={`${isExpanded ? 'rotate-180' : 'rotate-0'} transition-transform`} />
                                                    </button>
                                                </div>

                                                <div
                                                    className={`overflow-hidden transition-[max-height] duration-300`}
                                                    style={{ maxHeight: isExpanded ? '500px' : '0' }}
                                                >
                                                    <div className="whitespace-pre-wrap break-words text-sm bg-base-200 rounded-lg p-4 mt-2">
                                                        {request.description}
                                                    </div>
                                                </div>

                                                <InfoItem
                                                    icon={FiCalendar}
                                                    value={new Date(request.created_at).toLocaleDateString('ru-RU', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        <div className="card-actions justify-center mt-auto pt-4">
                                            <div className="flex gap-3 w-full">
                                                <button
                                                    className="btn btn-primary btn-sm flex-1"
                                                    onClick={() => onApprove(request.id)}
                                                >
                                                    Подтвердить
                                                </button>
                                                <button
                                                    className="btn btn-outline btn-sm flex-1"
                                                    onClick={() => onReject(request.id)}
                                                >
                                                    Отклонить
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
);

VerificationsTab.displayName = 'VerificationsTab';
