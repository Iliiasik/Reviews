import { useState } from 'react';
import * as yup from 'yup';
import { changePassword } from '../api/auth';
import { useToast } from '@shared/context/ToastContext';

const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required('Текущий пароль обязателен'),
    newPassword: yup
        .string()
        .required('Новый пароль обязателен')
        .min(8, 'Пароль должен быть не менее 8 символов')
        .max(32, 'Пароль не должен превышать 32 символа')
        .matches(
            /^(?=.*[0-9])(?=.*[!@#$%^&*.])/,
            'Пароль должен содержать минимум одну цифру и один специальный символ (!@#$%^&*)'
        ),
    confirmPassword: yup
        .string()
        .required('Подтверждение пароля обязательно')
        .oneOf([yup.ref('newPassword')], 'Пароли должны совпадать'),
});

export const useChangePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { showToast } = useToast();

    const handleChangePassword = async (data: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        setError('');
        setErrors({});

        try {
            await passwordSchema.validate(data, { abortEarly: false });

            setIsLoading(true);
            await changePassword({
                current_password: data.currentPassword,
                new_password: data.newPassword,
            });

            showToast('Пароль успешно изменён', 'success');
            return true;

        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const validationErrors = err.inner.reduce((acc, curr) => {
                    if (curr.path) acc[curr.path] = curr.message;
                    return acc;
                }, {} as Record<string, string>);
                setErrors(validationErrors);
            } else {
                setError(err instanceof Error ? err.message : 'Ошибка смены пароля');
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        errors,
        handleChangePassword,
    };
};