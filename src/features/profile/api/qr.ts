import axios from 'axios';

export const generateQrCode = async (): Promise<Blob> => {
    try {
        const response = await axios.get('/api/generate-qr', {
            responseType: 'blob',
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Ошибка генерации QR-кода');
    }
};
