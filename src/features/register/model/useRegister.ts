import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../api/register';
import { useWarnToast } from '../lib/useWarnToast';

export const useRegister = () => {
    const navigate = useNavigate();
    const toast = useWarnToast();
    const [step, setStep] = useState<1 | 2>(1);
    const [formStep, setFormStep] = useState<1 | 2 | 3>(1);
    const [accountType, setAccountType] = useState<'user' | 'specialist' | 'organization' | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        phone: '',
        experienceYears: '',
        about: '',
        website: '',
        address: '',
    });

    const handleAccountTypeSelect = (type: 'user' | 'specialist' | 'organization') => {
        setAccountType(type);
        setStep(2);
    };

    const handleBackToType = () => {
        setStep(1);
        setAccountType(null);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Валидация файла
            if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
                setError('Только JPG/PNG изображения');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('Максимальный размер 5MB');
                return;
            }

            setAvatarFile(file);
            setError('');

            // Превью аватара
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setAvatarPreview(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!accountType) {
                throw new Error('Выберите тип аккаунта');
            }

            // Создаем FormData
            const formDataToSend = new FormData();

            // Добавляем основные поля
            formDataToSend.append('username', formData.username);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('account_type', accountType);

            // Добавляем опциональные поля
            if (formData.experienceYears) {
                formDataToSend.append('experience_years', formData.experienceYears);
            }
            if (formData.about) {
                formDataToSend.append('about', formData.about);
            }
            if (formData.website) {
                formDataToSend.append('website', formData.website);
            }
            if (formData.address) {
                formDataToSend.append('address', formData.address);
            }

            // Добавляем аватар, если есть
            if (avatarFile) {
                formDataToSend.append('avatar', avatarFile);
            }

            // Отправляем запрос
            const response = await apiRegister(formDataToSend);

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
        formStep,
        accountType,
        formData,
        error,
        loading,
        showToast,
        toastMessage,
        avatarPreview,
        setShowToast,
        handleAccountTypeSelect,
        handleBackToType,
        handleChange,
        handleAvatarChange,
        handleSubmit,
        setFormStep,
    };
};