import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { updateProfile } from "@features/profile/api/profile.ts";
import { useLogout } from '@features/profile/model/useLogout';
import { useNavigate } from 'react-router-dom';

const baseSchema = yup.object().shape({
    name: yup.string().required('Обязательное поле'),
    email: yup.string().email('Некорректный email').required('Обязательное поле'),
    about: yup.string().when('role', {
        is: (role: string) => ['specialist', 'organization'].includes(role),
        then: (schema) => schema.required('Обязательное поле'),
        otherwise: (schema) => schema.notRequired(),
    }),
    phone: yup.string()
        .required('Обязательное поле')
        .test('phone-format', 'Неверный формат телефона', (value) => {
            const phoneRegex = /^\+996 \(\d{3}\)-\d{2}-\d{2}-\d{2}$/;
            return phoneRegex.test(value || '');
        }),
});

const specialistSchema = yup.object().shape({
    experience_years: yup
        .number()
        .typeError('Введите число')
        .integer('Должно быть целым числом')
        .min(0, 'Не может быть отрицательным')
        .max(60, 'Слишком большое значение')
        .when('role', {
            is: 'specialist',
            then: (schema) => schema.required('Обязательное поле'),
            otherwise: (schema) => schema.notRequired(),
        }),
});

const organizationSchema = yup.object().shape({
    website: yup.string().url('Некорректный URL').nullable(),
    address: yup.string().when('role', {
        is: 'organization',
        then: (schema) => schema.required('Обязательное поле'),
        otherwise: (schema) => schema.notRequired(),
    }),
});

interface FormData {
    name: string;
    email: string;
    phone: string;
    about: string;
    website: string;
    address: string;
    experience_years: string;
    role: string;
}

export const useEditProfile = (profile: any, onSuccess: () => void) => {
    const [form, setForm] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        about: '',
        website: '',
        address: '',
        experience_years: '',
        role: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailChanged, setEmailChanged] = useState(false);
    const logout = useLogout();
    const navigate = useNavigate();

    useEffect(() => {
        if (profile) {
            setForm({
                name: profile?.name ?? '',
                email: profile?.email ?? '',
                phone: profile?.phone ?? '',
                about: profile?.about ?? '',
                website: profile?.website ?? '',
                address: profile?.address ?? '',
                experience_years: profile?.experience_years?.toString() ?? '0',
                role: profile?.role ?? '',
            });
        }
    }, [profile]);

    useEffect(() => {
        if (profile && form.email !== profile.email) {
            setEmailChanged(true);
        } else {
            setEmailChanged(false);
        }
    }, [form.email, profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value === '' || /^\d+$/.test(value)) {
            setForm(prev => ({ ...prev, [name]: value }));

            if (errors[name]) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        }
    };

    const validateForm = async () => {
        try {
            let schema = baseSchema;

            if (form.role === 'specialist') {
                schema = schema.concat(specialistSchema);
            } else if (form.role === 'organization') {
                schema = schema.concat(organizationSchema);
            }

            await schema.validate(form, { abortEarly: false });
            return true;
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const newErrors = err.inner.reduce((acc, curr) => {
                    if (curr.path) acc[curr.path] = curr.message;
                    return acc;
                }, {} as Record<string, string>);
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const isValid = await validateForm();
            if (!isValid) {
                throw new Error('Пожалуйста, исправьте ошибки в форме');
            }

            const payload = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                about: form.about,
                ...(form.role === 'organization' && {
                    website: form.website,
                    address: form.address,
                }),
                ...(form.role === 'specialist' && {
                    experience_years: parseInt(form.experience_years || '0'),
                }),
            };

            const response = await updateProfile(payload);

            if (response.requires_logout) {
                await logout();
                navigate('/login', {
                    state: {
                        message: 'Email изменен. На ваш новый email отправлено письмо с подтверждением. Пожалуйста, подтвердите email и войдите снова.'
                    }
                });
                return;
            }

            onSuccess();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Ошибка при сохранении');
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        errors,
        error,
        loading,
        emailChanged,
        handleChange,
        handleNumberChange,
        handleSubmit,
    };
};