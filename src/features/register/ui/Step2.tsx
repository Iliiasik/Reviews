import { Input, Textarea } from './FormFields.tsx';
import type {StepComponentProps} from '../types/StepForm.ts';

export const Step2 = ({ formData, accountType, handleChange, onNext, onBack }: StepComponentProps) => (
    <>
        <Input name="username" label="Логин" value={formData.username} onChange={handleChange} />
        <Input name="password" type="password" label="Пароль" value={formData.password} onChange={handleChange} />

        {accountType === 'specialist' && (
            <>
                <Input name="experienceYears" type="number" label="Опыт (в годах)" value={formData.experienceYears || ''} onChange={handleChange} />
                <Textarea name="about" label="О себе" value={formData.about || ''} onChange={handleChange} />
            </>
        )}

        {accountType === 'organization' && (
            <>
                <Input name="website" label="Сайт" value={formData.website || ''} onChange={handleChange} />
                <Input name="address" label="Адрес" value={formData.address || ''} onChange={handleChange} />
                <Textarea name="about" label="О нас" value={formData.about || ''} onChange={handleChange} />
            </>
        )}

        <div className="flex justify-end gap-4 mt-4">
            <button type="button" className="btn" onClick={onBack}>Назад</button>
            <button type="button" className="btn btn-primary" onClick={onNext}>Далее</button>
        </div>
    </>
);
