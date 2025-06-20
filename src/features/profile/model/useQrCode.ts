import { useState } from 'react';
import { generateQrCode } from '../api/qr';
import { useToast } from '@features/profile/model/useToast';

export const useQrCode = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const { showToast } = useToast();

    const generate = async () => {
        try {
            const code = await generateQrCode();
            setQrCode(code);
            showToast('QR-код успешно сгенерирован', 'success');
        } catch (error) {
            console.error('Ошибка при генерации QR-кода:', error);
            showToast('Ошибка при генерации QR-кода', 'error');
        }
    };

    const download = () => {
        if (!qrCode) return;
        const link = document.createElement('a');
        link.href = qrCode;
        link.download = 'my-qr-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return {
        qrCode,
        generate,
        download,
    };
};