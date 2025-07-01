import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../api/register';
import { useWarnToast } from '../lib/useWarnToast';
import * as yup from 'yup';

const step1Schema = yup.object().shape({
    name: yup.string().required('Обязательное поле'),
    email: yup.string().email('Некорректный email').required('Обязательное поле'),
    phone: yup.string().required('Обязательное поле'),
});

const step2Schema = yup.object().shape({
    username: yup.string().required('Обязательное поле'),
    password: yup.string().min(8, 'Минимум 8 символов').required('Обязательное поле'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Пароли не совпадают')
        .required('Обязательное поле'),
});

const specialistSchema = yup.object().shape({
    experienceYears: yup
        .number()
        .typeError('Обязательное поле')
        .required('Обязательное поле')
        .min(0, 'Не может быть отрицательным'),
    about: yup.string().required('Обязательное поле'),
});


const organizationSchema = yup.object().shape({
    website: yup.string().url('Некорректный URL').nullable(),
    address: yup.string().required('Обязательное поле'),
    about: yup.string().required('Обязательное поле'),
});

export const useRegister = () => {
    const navigate = useNavigate();
    const toast = useWarnToast();
    const [step, setStep] = useState<1 | 2>(1);
    const [accountType, setAccountType] = useState<'user' | 'specialist' | 'organization' | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
        phone: '',
        experienceYears: 0,
        about: '',
        website: '',
        address: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleAccountTypeSelect = (type: 'user' | 'specialist' | 'organization') => {
        setAccountType(type);
        setStep(2);
    };

    const handleBackToType = () => {
        setStep(1);
        setAccountType(null);
    };
 // нужно найти решение получше
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'experienceYears'
                ? (value === '' ? '' : Number(value))
                : value,
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateStep1 = async () => {
        try {
            await step1Schema.validate(formData, { abortEarly: false });
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

    const validateStep2 = async () => {
        try {
            await step2Schema.validate(formData, { abortEarly: false });

            if (accountType === 'specialist') {
                await specialistSchema.validate(formData, { abortEarly: false });
            }

            if (accountType === 'organization') {
                await organizationSchema.validate(formData, { abortEarly: false });
            }

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
            if (!accountType) throw new Error('Выберите тип аккаунта');

            const isStep1Valid = await validateStep1();
            const isStep2Valid = await validateStep2();

            if (!isStep1Valid || !isStep2Valid) {
                throw new Error('Пожалуйста, исправьте ошибки в форме');
            }

            const dataToSend = {
                username: formData.username,
                password: formData.password,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                account_type: accountType,
                ...(accountType === 'specialist' && {
                    experience_years: formData.experienceYears,
                    about: formData.about,
                }),
                ...(accountType === 'organization' && {
                    website: formData.website,
                    address: formData.address,
                    about: formData.about,
                }),
            };

            const response = await apiRegister(dataToSend);

            setToastMessage(response.message || 'Регистрация успешна');
            setShowToast(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка регистрации');
            toast('Ошибка при регистрации');
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        accountType,
        formData,
        errors,
        error,
        loading,
        showToast,
        toastMessage,
        setShowToast,
        handleAccountTypeSelect,
        handleBackToType,
        handleChange,
        handleSubmit,
        validateStep1,
        validateStep2,
    };
};