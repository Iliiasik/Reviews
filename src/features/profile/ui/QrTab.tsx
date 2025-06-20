import { forwardRef } from 'react';

interface QrTabProps {
    qrCode: string | null;
    onGenerate: () => void;
    onDownload: () => void;
}

export const QrTab = forwardRef<HTMLDivElement, QrTabProps>(({ qrCode, onGenerate, onDownload }, ref) => (
    <div ref={ref} className="px-6 py-5">
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
                                onClick={onDownload}
                            >
                                Скачать
                            </button>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={onGenerate}
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
                            onClick={onGenerate}
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
));