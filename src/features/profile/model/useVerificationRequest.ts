import { useState } from 'react';
import { useToast } from '@shared/context/ToastContext';
import { VerificationRequestApi } from '../api/verification_request';

export const useVerificationRequest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const submitRequest = async (description: string) => {
        setIsLoading(true);
        try {
            await VerificationRequestApi.create(description);
            showToast('Заявка отправлена администратору', 'success');
            return true;
        } catch (error: any) {
            console.error('Ошибка отправки заявки:', error);
            const message = error.response?.data?.message || 'Ошибка отправки заявки';
            showToast(message, 'error');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { submitRequest, isLoading };
};