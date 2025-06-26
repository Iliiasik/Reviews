import { forwardRef, useState } from 'react';
import Toast from '@shared/ui/Toast';

interface QrTabProps {
    qrCode: string | null;
    onGenerate: () => void;
    onDownload: () => void;
}

export const QrTab = forwardRef<HTMLDivElement, QrTabProps>(
    ({ qrCode, onGenerate, onDownload }, ref) => {
        const [toastMessage, setToastMessage] = useState<string | null>(null);

        const handleShare = () => {
            if (!qrCode) return;

            fetch(qrCode)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'qr-code.png', { type: 'image/png' });

                    if (navigator.share && navigator.canShare?.({ files: [file] })) {
                        navigator.share({
                            title: 'Оставьте отзыв',
                            text: 'Просканируйте QR-код, чтобы оставить отзыв',
                            files: [file],
                        }).catch(() => {
                            setToastMessage('Ошибка при попытке поделиться');
                        });
                    } else {
                        setToastMessage('Ваш браузер не поддерживает функцию «Поделиться»');
                    }
                });
        };

        return (
            <div ref={ref} className="px-6 py-5">
                <div className="max-w-md mx-auto">
                    <h2 className="text-xl font-semibold mb-2">QR-код для отзыва</h2>
                    <p className="text-base-content/70 mb-6">
                        Поделитесь этим QR-кодом, чтобы получить отзыв от клиента
                    </p>

                    <div className="flex flex-col items-center space-y-6">
                        {qrCode ? (
                            <>
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body items-center">
                                        <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-3">
                                    <button className="btn btn-primary btn-sm" onClick={onDownload}>
                                        Скачать
                                    </button>
                                    <button className="btn btn-accent btn-sm" onClick={handleShare}>
                                        Поделиться
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
                                <button className="btn btn-primary btn-sm" onClick={onGenerate}>
                                    Сгенерировать QR-код
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {toastMessage && (
                    <Toast
                        message={toastMessage}
                        type="warning"
                        onClose={() => setToastMessage(null)}
                    />
                )}
            </div>
        );
    }
);
