import React from 'react';
import { useChangePassword } from '../model/useChangePassword';

interface ChangePasswordModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, onSuccess }) => {
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const { isLoading, error, handleChangePassword } = useChangePassword();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await handleChangePassword({
            currentPassword,
            newPassword,
            confirmPassword,
        });

        if (success) {
            onSuccess();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg w-full max-w-sm shadow-lg">
                <h3 className="text-xl font-bold mb-4">Смена пароля</h3>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="password"
                        className="input input-bordered w-full"
                        placeholder="Текущий пароль"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="input input-bordered w-full"
                        placeholder="Новый пароль"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="input input-bordered w-full"
                        placeholder="Подтверждение пароля"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                    {error && <div className="text-error text-sm">{error}</div>}
                    <div className="flex justify-end gap-4">
                        <button type="button" className="btn" onClick={onClose}>Отмена</button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Сохраняем...' : 'Сменить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};