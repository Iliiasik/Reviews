import {Input, NumberInput, Textarea} from './FormFields.tsx';
import type { StepComponentProps } from '../types/StepForm.ts';
import { usePasswordStrength } from '../lib/usePasswordStrength';

export const AdditionalInfoStep = ({
                                       formData,
                                       accountType,
                                       handleChange,
                                       errors,
                                       onBack,
                                       onSubmit,
                                       loading = false,
                                   }: StepComponentProps) => {
    const { strength, evaluateStrength } = usePasswordStrength();

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        evaluateStrength(e.target.value);
    };

    const strengthConfig = {
        weak: {
            color: 'bg-error',
            label: 'Слабый',
            width: 'w-1/3',
            textColor: 'text-error'
        },
        medium: {
            color: 'bg-warning',
            label: 'Средний',
            width: 'w-2/3',
            textColor: 'text-warning'
        },
        strong: {
            color: 'bg-success',
            label: 'Сильный',
            width: 'w-full',
            textColor: 'text-success'
        }
    };

    return (
        <>
            <Input
                name="username"
                label="Логин"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
            />

            <div className="space-y-1">
                <Input
                    name="password"
                    type="password"
                    label="Пароль"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    error={errors.password}
                />
                {strength && (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-full bg-base-200 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full transition-all duration-300 ${strengthConfig[strength].color} ${strengthConfig[strength].width}`}
                                ></div>
                            </div>
                            <span className={`text-xs font-medium ${strengthConfig[strength].textColor}`}>
                                {strengthConfig[strength].label}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <Input
                name="confirmPassword"
                type="password"
                label="Повторите пароль"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
            />

            {accountType === 'specialist' && (
                <>
                    <NumberInput
                        name="experienceYears"
                        label="Опыт (в годах)"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        error={errors.experienceYears}
                    />
                    <Textarea
                        name="about"
                        label="О себе"
                        value={formData.about || ''}
                        onChange={handleChange}
                        error={errors.about}
                    />
                </>
            )}

            {accountType === 'organization' && (
                <>
                    <Input
                        name="website"
                        label="Сайт"
                        value={formData.website || ''}
                        onChange={handleChange}
                        error={errors.website}
                    />
                    <Input
                        name="address"
                        label="Адрес"
                        value={formData.address || ''}
                        onChange={handleChange}
                        error={errors.address}
                    />
                    <Textarea
                        name="about"
                        label="О нас"
                        value={formData.about || ''}
                        onChange={handleChange}
                        error={errors.about}
                    />
                </>
            )}

            <div className="flex justify-end gap-4 mt-4">
                <button
                    type="button"
                    className={`btn ${loading ? 'btn-disabled' : ''}`}
                    onClick={onBack}
                    disabled={loading}
                >
                    Назад
                </button>
                <button
                    type="button"
                    className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}
                    onClick={onSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="loading loading-spinner loading-sm"></span>
                            Отправка...
                        </span>
                    ) : (
                        'Зарегистрироваться'
                    )}
                </button>
            </div>
        </>
    );
};