import { useState } from 'react';
import { changePassword } from '../api/auth';

export const useChangePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChangePassword = async (data: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        setError('');

        if (data.newPassword.length < 6) {
            setError('Пароль должен быть не менее 6 символов');
            return false;
        }

        if (data.newPassword !== data.confirmPassword) {
            setError('Пароли не совпадают');
            return false;
        }

        setIsLoading(true);

        try {
            await changePassword({
                current_password: data.currentPassword,
                new_password: data.newPassword,
            });
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка смены пароля');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        handleChangePassword,
    };
};