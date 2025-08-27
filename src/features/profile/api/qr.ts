import api from '@shared/axios/axios';

export const generateQrCode = async (): Promise<Blob> => {
    try {
        const response = await api.get('/generate-qr', {
            responseType: 'blob',
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка генерации QR-кода');
    }
};
