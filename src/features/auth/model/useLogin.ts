import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/login';

export const useLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ username, password });
            navigate('/profile', { state: { loginSuccess: true } });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка при входе');
        } finally {
            setLoading(false);
        }
    };

    return {
        username,
        password,
        error,
        loading,
        handleSubmit,
        handleUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value),
        handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value),
    };
};