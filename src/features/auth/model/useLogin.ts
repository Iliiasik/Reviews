import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, LoginError } from '../api/login';

export const useLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errorCode, setErrorCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setErrorCode('');
        setLoading(true);

        try {
            await login({ username, password });
            navigate('/profile', { state: { loginSuccess: true } });
        } catch (err) {
            if (err instanceof LoginError) {
                setError(err.message);
                setErrorCode(err.code || '');
            } else {
                setError('Ошибка при входе');
                setErrorCode('');
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        username,
        password,
        error,
        errorCode,
        loading,
        handleSubmit,
        handleUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value),
        handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value),
    };
};
