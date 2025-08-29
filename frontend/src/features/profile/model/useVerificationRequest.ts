import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useToast } from '@shared/context/ToastContext';
import { VerificationRequestApi } from '../api/verification_request';

export const useVerificationRequest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [hasPendingRequest, setHasPendingRequest] = useState(false);
    const { showToast } = useToast();

    const validationSchema = yup.object({
        description: yup
            .string()
            .required('Пожалуйста, заполните описание')
            .min(10, 'Описание должно содержать минимум 10 символов')
            .max(200, 'Описание не должно превышать 200 символов')
            .test(
                'no-links',
                'Нельзя указывать ссылки в описании',
                (value) => !/(http|https|www\.|\.[a-z]{2,})/i.test(value || '')
            ),
    });

    const checkVerificationStatus = async () => {
        try {
            const status = await VerificationRequestApi.checkStatus();
            setHasPendingRequest(status.hasPendingRequest);
        } catch (error) {
            console.error('Ошибка проверки статуса:', error);
            showToast('Не удалось проверить статус верификации', 'error');
        } finally {
            setStatusLoading(false);
        }
    };

    useEffect(() => {
        checkVerificationStatus();
    }, []);

    const validateForm = async (data: { description: string }) => {
        try {
            await validationSchema.validate(data, { abortEarly: false });
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors = error.inner.reduce((acc, curr) => {
                    if (curr.path) acc[curr.path] = curr.message;
                    return acc;
                }, {} as Record<string, string>);
                setErrors(newErrors);
            }
            return false;
        }
    };

    const submitRequest = async (description: string) => {
        const isValid = await validateForm({ description });
        if (!isValid) return false;

        setIsLoading(true);
        try {
            await VerificationRequestApi.create(description);
            setHasPendingRequest(true);
            showToast('Заявка отправлена администратору', 'success');
            return true;
        } catch (error: any) {
            console.error('Ошибка отправки заявки:', error);
            const message = error.response?.data?.message || 'Произошла ошибка при отправке заявки';
            showToast(message, 'error');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        submitRequest,
        isLoading,
        statusLoading,
        errors,
        hasPendingRequest
    };
};
