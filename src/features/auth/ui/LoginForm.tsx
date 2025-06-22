import { Input } from '@shared/ui/Input';
import { GoogleButton } from '@shared/ui/GoogleButton';
import { Link } from 'react-router-dom';
import { useLogin } from '../model/useLogin';
import { useResendConfirmation } from '../model/useResendConfirmation';
import { EnvelopeIcon, ArrowPathIcon, ClockIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export const LoginForm = () => {
    const {
        username,
        password,
        error,
        errorCode,
        loading,
        handleSubmit,
        handleUsernameChange,
        handlePasswordChange,
    } = useLogin();

    const {
        cooldown,
        resending,
        success: resendSuccess,
        resend,
    } = useResendConfirmation(username);

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

            {errorCode === 'EMAIL_NOT_CONFIRMED' && (
                <div className="flex items-center justify-between gap-3 mt-2 p-2 bg-base-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                        {resendSuccess ? (
                            <div className="flex items-center text-success">
                                <EnvelopeIcon className="w-4 h-4" />
                                <span className="ml-1">Письмо отправлено</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-info">
                                <ArrowPathIcon className="w-4 h-4" />
                                <span className="ml-1">Можно отправить письмо повторно</span>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        className={`btn btn-sm flex items-center gap-1 ${
                            resending || cooldown > 0 ? "btn-ghost" : "btn-primary"
                        }`}
                        disabled={cooldown > 0 || resending}
                        onClick={resend}
                    >
                        {resending ? (
                            <>
                                <ArrowPathIcon className="w-3 h-3 animate-spin" />
                                <span>Отправка...</span>
                            </>
                        ) : cooldown > 0 ? (
                            <>
                                <ClockIcon className="w-3 h-3" />
                                <span>{cooldown} сек.</span>
                            </>
                        ) : (
                            <>
                                <PaperAirplaneIcon className="w-3 h-3" />
                                <span>Отправить</span>
                            </>
                        )}
                    </button>
                </div>
            )}

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
