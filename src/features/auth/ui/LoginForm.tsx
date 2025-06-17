import { Input } from '@shared/ui/Input';
import { GoogleButton } from '@shared/ui/GoogleButton';
import { Link } from 'react-router-dom';
import { useLogin } from '../model/useLogin';

export const LoginForm = () => {
    const {
        username,
        password,
        error,
        loading,
        handleSubmit,
        handleUsernameChange,
        handlePasswordChange,
    } = useLogin();

    return (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <Input
                label="Логин"
                name="username"
                value={username}
                onChange={handleUsernameChange}
                disabled={loading}
                error={!!error}
            />

            <Input
                label="Пароль"
                name="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                disabled={loading}
                error={!!error}
            />

            {error && <div className="text-error text-sm text-center">{error}</div>}

            <button
                type="submit"
                className="btn btn-primary w-full mt-4"
                disabled={loading}
            >
                {loading ? 'Входим...' : 'Войти'}
            </button>

            <div className="divider text-sm">или</div>
            <GoogleButton />

            <div className="mt-6 text-center text-sm">
                <span>Ещё нет аккаунта?</span>{' '}
                <Link to="/register" className="link link-primary">
                    Зарегистрируйтесь
                </Link>
            </div>
        </form>
    );
};