import React, { useState } from 'react';

interface Props {
    onClose: () => void;
    onSuccess: (message: string) => void;
}

const ChangePasswordModal: React.FC<Props> = ({ onClose, onSuccess }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('Пароль должен быть не менее 6 символов');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/change-password', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            const data = await res.json();
            setLoading(false);

            if (res.ok) {
                onSuccess(data.message || 'Пароль успешно изменён');
                onClose();
            } else {
                setError(data.error || 'Ошибка смены пароля');
            }
        } catch (err) {
            setLoading(false);
            setError('Ошибка сети при смене пароля');
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
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Сохраняем...' : 'Сменить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
