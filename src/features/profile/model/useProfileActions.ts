import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, changePassword } from '../api/auth';
import { useToast } from '@features/profile/model/useToast';

export const useProfileActions = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    const handleChangePassword = async (data: {
        currentPassword: string;
        newPassword: string;
    }) => {
        setIsChangingPassword(true);
        try {
            await changePassword({
                current_password: data.currentPassword,
                new_password: data.newPassword,
            });
            showToast('Пароль успешно изменён', 'success');
            return true;
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Ошибка смены пароля', 'error');
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