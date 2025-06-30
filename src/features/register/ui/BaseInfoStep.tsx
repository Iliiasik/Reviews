import { IMaskInput } from 'react-imask';
import { Input } from './FormFields.tsx';
import type { StepComponentProps } from '../types/StepForm';

export const BaseInfoStep = ({
                                 formData,
                                 handleChange,
                                 errors,
                                 onNext,
                             }: Omit<StepComponentProps, 'accountType'>) => {
    return (
        <>
            <Input
                name="name"
                label="Имя / Название"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
            />

            <Input
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
            />

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
                    className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
                />

                {errors.phone && (
                    <span className="text-error text-sm">{errors.phone}</span>
                )}
            </div>

            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onNext}
                >
                    Далее
                </button>
            </div>
        </>
    );
};