import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@shared/context/ToastContext';
import { useLogout } from '@features/profile/model/useLogout.ts';

export const useProfileActions = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const logout = useLogout();

    const handleLogout = async () => {
        try {
            await logout();
            showToast('Вы успешно вышли из системы', 'success');
            navigate('/login');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            showToast('Ошибка при выходе', 'error');
        }
    };

    const handleChangePassword = async (data: {
        currentPassword: string;
        newPassword: string;
    }) => {
        setIsChangingPassword(true);
        try {
            await axios.post(
                '/api/change-password',
                {
                    current_password: data.currentPassword,
                    new_password: data.newPassword,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            showToast('Пароль успешно изменён', 'success');
            return true;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                showToast(
                    error.response?.data?.error || 'Ошибка смены пароля',
                    'error'
                );
            } else if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast('Неизвестная ошибка', 'error');
            }
            return false;
        } finally {
            setIsChangingPassword(false);
        }
    };

    return {
        handleLogout,
        handleChangePassword,
        isChangingPassword,
    };
};