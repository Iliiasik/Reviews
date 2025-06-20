import { Input } from './FormFields.tsx';
import { useState } from 'react';
import type {StepComponentProps} from '../types/StepForm.ts';

export const Step1 = ({ formData, handleChange, onNext }: StepComponentProps) => {
    const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

    const validateFields = () => {
        const newErrors: typeof errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?\d{9,15}$/;

        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Введите корректный Email';
        }

        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Введите корректный номер телефона';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextClick = () => {
        if (validateFields()) {
            onNext?.();
        }
    };

    return (
        <>
            <Input name="name" label="Имя" value={formData.name} onChange={handleChange} />
            <div className="space-y-1">
                <Input name="email" label="Email" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="text-error text-sm">{errors.email}</span>}
            </div>
            <div className="space-y-1">
                <Input name="phone" label="Телефон" value={formData.phone} onChange={handleChange} />
                {errors.phone && <span className="text-error text-sm">{errors.phone}</span>}
            </div>
            <div className="flex justify-end mt-4">
                <button type="button" className="btn btn-primary" onClick={handleNextClick}>
                    Далее
                </button>
            </div>
        </>
    );
};
