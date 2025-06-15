// src/components/Register/StepForm.tsx
import { Input, Textarea } from './FormFields';

const StepForm = ({ accountType, formData, handleChange, handleSubmit, alert, onBack }: any) => (
    <form className="space-y-4" onSubmit={handleSubmit}>
        <Input name="name" label="Имя" value={formData.name} onChange={handleChange} />
        <Input name="email" label="Email" value={formData.email} onChange={handleChange} />
        <Input name="phone" label="Телефон" value={formData.phone} onChange={handleChange} />
        <Input name="username" label="Логин" value={formData.username} onChange={handleChange} />
        <Input name="password" type="password" label="Пароль" value={formData.password} onChange={handleChange} />

        {accountType === 'specialist' && (
            <>
                <Input name="experienceYears" type="number" label="Опыт (в годах)" value={formData.experienceYears} onChange={handleChange} />
                <Textarea name="about" label="О себе" value={formData.about} onChange={handleChange} />
            </>
        )}

        {accountType === 'organization' && (
            <>
                <Input name="website" label="Сайт" value={formData.website} onChange={handleChange} />
                <Input name="address" label="Адрес" value={formData.address} onChange={handleChange} />
                <Textarea name="about" label="О нас" value={formData.about} onChange={handleChange} />
            </>
        )}

        {alert && (
            <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'} shadow-lg`}>
                <span>{alert.message}</span>
            </div>
        )}

        <div className="flex justify-between gap-4 mt-4">
            <button type="button" className="btn w-1/2" onClick={onBack}>
                Назад
            </button>
            <button type="submit" className="btn btn-primary w-1/2">
                Зарегистрироваться
            </button>
        </div>
    </form>
);

export default StepForm;
