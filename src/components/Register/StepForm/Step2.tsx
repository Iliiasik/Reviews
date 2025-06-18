import { Input, Textarea } from '../FormFields';
import type {StepComponentProps} from '../../../types/StepForm';

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

        <div className="flex justify-between gap-4 mt-4">
            <button type="button" className="btn w-1/2" onClick={onBack}>Назад</button>
            <button type="button" className="btn btn-primary w-1/2" onClick={onNext}>Далее</button>
        </div>
    </>
);
