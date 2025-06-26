import { IMaskInput } from 'react-imask';
import { Input } from './FormFields.tsx';
import { useState } from 'react';
import type { StepComponentProps } from '../types/StepForm.ts';

export const AccountTypeSelectStep = ({
                          formData,
                          handleChange,
                          onNext,
                      }: StepComponentProps) => {
    const [errors, setErrors] = useState<{ email?: string; phone?: string }>(
        {}
    );

    const validateFields = () => {
        const newErrors: typeof errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Введите корректный Email';
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
            <Input
                name="name"
                label="Имя / Название"
                value={formData.name}
                onChange={handleChange}
            />

            <div className="space-y-1">
                <Input
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && (
                    <span className="text-error text-sm">{errors.email}</span>
                )}
            </div>

            <div className="space-y-1">
                <label className="label">
                    <span className="label-text">Телефон</span>
                </label>

                <IMaskInput
                    mask={'+996 (000)-00-00-00'}
                    value={formData.phone}
                    unmask={false}
                    onAccept={(value: string) => {
                        handleChange({
                            target: { name: 'phone', value },
                        } as any);
                    }}
                    placeholder="+996 (XXX)-XX-XX-XX"
                    type="tel"
                    name="phone"
                    className="input input-bordered w-full"
                />

                {errors.phone && (
                    <span className="text-error text-sm">{errors.phone}</span>
                )}
            </div>

            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextClick}
                >
                    Далее
                </button>
            </div>
        </>
    );
};
