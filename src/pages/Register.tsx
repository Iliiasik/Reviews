import { RegisterForm } from '@features/register/ui/RegisterForm.tsx';
import {RegisterLayout} from "@widgets/layout/RegisterLayout.tsx";

export const Register = () => {
    return (
        <RegisterLayout title="Регистрация">
            <RegisterForm />
        </RegisterLayout>
    );
};