import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../api/register';
import { uploadAvatar } from '../api/avatar';

interface RegisterFormData {
    username: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    experienceYears: string;
    about: string;
    website: string;
    address: string;
}

export const useRegister = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [formStep, setFormStep] = useState<1 | 2 | 3>(1);
    const [accountType, setAccountType] = useState<'user' | 'specialist' | 'organization' | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState<RegisterFormData>({
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
            if (!accountType) throw new Error('Выберите тип аккаунта');

            // Подготовка данных
            const payload = {
                ...formData,
                account_type: accountType,
                experience_years: formData.experienceYears ? parseInt(formData.experienceYears) : undefined,
                avatar_ext: avatarFile ? `.${avatarFile.name.split('.').pop()?.toLowerCase()}` : undefined,
            };

            // 1. Регистрация
            const response = await apiRegister(payload);

            // 2. Загрузка аватара
            if (avatarFile && response.user_id) {
                await uploadAvatar(
                    response.user_id.toString(),
                    accountType,
                    avatarFile
                );
            }

            setToastMessage(response.message || 'Регистрация успешна');
            setShowToast(true);
            setTimeout(() => navigate('/login'), 2000);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка');
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