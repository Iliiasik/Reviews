import { AuthLayout } from '@widgets/layout/AuthLayout';
import { RegisterForm } from '@features/register/ui/RegisterForm.tsx';

export const Register = () => {
    return (
        <AuthLayout title="Регистрация">
            <RegisterForm />
        </AuthLayout>
    );
};