import { forwardRef } from 'react';

interface VerificationRequest {
    id: number;
    user: {
        name: string;
        role: string;
        email?: string;
    };
    description: string;
    created_at?: string;
}

interface VerificationsTabProps {
    requests: VerificationRequest[];
    loading: boolean;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}

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
                    <p className="text-center py-8">Нет активных заявок</p>
                ) : (
                    <div className="space-y-4">
                        {requests.map(request => (
                            <div key={request.id} className="card bg-base-100 shadow-sm">
                                <div className="card-body">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="card-title text-lg">{request.user.name}</h3>
                                                <span className="badge badge-info">
                                                    {request.user.role === 'specialist' ? 'Специалист' : 'Организация'}
                                                </span>
                                            </div>
                                            {request.user.email && (
                                                <p className="text-sm text-base-content/70 mb-2">
                                                    {request.user.email}
                                                </p>
                                            )}
                                            <p className="text-sm mb-3">{request.description}</p>
                                            {request.created_at && (
                                                <p className="text-xs text-base-content/50">
                                                    Создано: {new Date(request.created_at).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 self-start md:self-center">
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => onApprove(request.id)}
                                            >
                                                Подтвердить
                                            </button>
                                            <button
                                                className="btn btn-sm btn-error"
                                                onClick={() => onReject(request.id)}
                                            >
                                                Отклонить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
);