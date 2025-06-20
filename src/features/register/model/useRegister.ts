import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/register.ts';

export const useRegister = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [formStep, setFormStep] = useState<1 | 2 | 3>(1);
    const [accountType, setAccountType] = useState<'user' | 'specialist' | 'organization' | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = {
                ...formData,
                account_type: accountType!,
                experience_years: formData.experienceYears ? parseInt(formData.experienceYears) : undefined,
            };

            await register(payload);
            navigate('/profile', { state: { registerSuccess: true } });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка регистрации');
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
        handleAccountTypeSelect,
        handleBackToType,
        handleChange,
        handleSubmit,
        setFormStep,
    };
};