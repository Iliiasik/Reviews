import { AuthLayout } from '@widgets/layout/AuthLayout.tsx';
import { LoginForm } from '@features/auth/ui/LoginForm.tsx';

export const Login = () => {
    return (
        <AuthLayout title="Вход в систему">
            <LoginForm />
        </AuthLayout>
    );
};