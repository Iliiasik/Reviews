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
    const { isLoading, error, errors, handleChangePassword } = useChangePassword();

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
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-base-100/70 backdrop-blur-md p-6 rounded-2xl w-full max-w-md shadow-xl border border-base-200 border-opacity-40">
                <h3 className="text-xl font-bold mb-4">Смена пароля</h3>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Текущий пароль</span>
                        </label>
                        <input
                            type="password"
                            className={`input input-bordered w-full opacity-75 ${errors.currentPassword ? 'input-error' : ''}`}
                            placeholder="Текущий пароль"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}

                        />
                        {errors.currentPassword && (
                            <span className="text-error text-sm mt-1">{errors.currentPassword}</span>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Новый пароль</span>
                        </label>
                        <input
                            type="password"
                            className={`input input-bordered w-full opacity-75 ${errors.newPassword ? 'input-error' : ''}`}
                            placeholder="Новый пароль"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}

                        />
                        {errors.newPassword && (
                            <span className="text-error text-sm mt-1">{errors.newPassword}</span>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Подтверждение пароля</span>
                        </label>
                        <input
                            type="password"
                            className={`input input-bordered w-full opacity-75 ${errors.confirmPassword ? 'input-error' : ''}`}
                            placeholder="Подтверждение пароля"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errors.confirmPassword && (
                            <span className="text-error text-sm mt-1">{errors.confirmPassword}</span>
                        )}
                    </div>

                    {error && <div className="text-error text-sm">{error}</div>}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            className="btn btn-ghost bg-opacity-5 hover:bg-opacity-10"
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="btn bg-opacity-10 hover:bg-opacity-20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  Сохраняем...
                </span>
                            ) : 'Сменить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};