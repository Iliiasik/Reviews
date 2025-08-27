import { useState, useEffect } from 'react';
import { generateQrCode } from '../api/qr';

export const useQrCode = () => {
    const [qrUrl, setQrUrl] = useState<string | null>(null);

    const generate = async () => {
        try {
            const blob = await generateQrCode();
            const url = URL.createObjectURL(blob);
            setQrUrl(prev => {
                if (prev) URL.revokeObjectURL(prev);
                return url;
            });
        } catch (err) {
            console.error('Ошибка генерации QR:', err);
        }
    };

    const download = () => {
        if (!qrUrl) return;
        const link = document.createElement('a');
        link.href = qrUrl;
        link.download = 'qr-code.png';
        link.click();
    };

    useEffect(() => {
        return () => {
            if (qrUrl) URL.revokeObjectURL(qrUrl);
        };
    }, [qrUrl]);

    return { qrUrl, generate, download };
};
