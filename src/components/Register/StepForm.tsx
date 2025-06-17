import { Input, Textarea } from './FormFields';
import { motion, AnimatePresence } from 'framer-motion';
import React from "react";
interface StepFormProps {
    accountType: 'user' | 'specialist' | 'organization' | null;
    formData: Record<string, string>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
    formStep: number;
    setFormStep: (step: number) => void;
}

const StepForm: React.FC<StepFormProps> = ({
                                               accountType,
                                               formData,
                                               handleChange,
                                               handleSubmit,
                                               onBack,
                                               formStep,
                                               setFormStep
                                           }) => {

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Левая часть — форма */}
            <div className="w-full lg:w-1/2">
                <div className="flex items-center mb-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="btn btn-ghost btn-sm p-2"
                        aria-label="Назад к выбору"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 stroke-base-content"
                        >
                            <path
                                d="M15 6L9 12L15 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={formStep}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.15, ease: 'easeInOut' }}
                            className="space-y-4"
                        >
                            {formStep === 1 && (
                                <>
                                    <Input name="name" label="Имя" value={formData.name} onChange={handleChange} />
                                    <Input name="email" label="Email" value={formData.email} onChange={handleChange} />
                                    <Input name="phone" label="Телефон" value={formData.phone} onChange={handleChange} />
                                    <div className="flex justify-end mt-4">
                                        <button type="button" className="btn btn-primary" onClick={() => setFormStep(2)}>
                                            Далее
                                        </button>
                                    </div>
                                </>
                            )}

                            {formStep === 2 && (
                                <>
                                    <Input name="username" label="Логин" value={formData.username} onChange={handleChange} />
                                    <Input name="password" type="password" label="Пароль" value={formData.password} onChange={handleChange} />

                                    {accountType === 'specialist' && (
                                        <>
                                            <Input
                                                name="experienceYears"
                                                type="number"
                                                label="Опыт (в годах)"
                                                value={formData.experienceYears}
                                                onChange={handleChange}
                                            />
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

                                    <div className="flex justify-between gap-4 mt-4">
                                        <button type="button" className="btn w-1/2" onClick={() => setFormStep(1)}>
                                            Назад
                                        </button>
                                        <button type="button" className="btn btn-primary w-1/2" onClick={() => setFormStep(3)}>
                                            Далее
                                        </button>
                                    </div>
                                </>
                            )}

                            {formStep === 3 && (
                                <>
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Фото профиля</span>
                                        </label>
                                        <input
                                            type="file"
                                            name="avatar"
                                            accept="image/*"
                                            className="file-input file-input-bordered w-full"
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="flex justify-between gap-4 mt-4">
                                        <button type="button" className="btn w-1/2" onClick={() => setFormStep(2)}>
                                            Назад
                                        </button>
                                        <button type="submit" className="btn btn-primary w-1/2">
                                            Зарегистрироваться
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="w-full flex flex-col items-center mb-6">
                        <div className="w-full max-w-md h-1 bg-base-300 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${formStep === 1 ? 33 : formStep === 2 ? 66 : 100}%` }}
                            />
                        </div>
                    </div>

                </form>
            </div>

            {/* Вертикальный разделитель */}
            <div className="hidden lg:flex divider divider-horizontal" />

            {/* Правая часть — мокап */}
            <div className="hidden lg:block w-1/2">
                <div className="mockup-window border bg-base-300">
                    <div className="px-4 py-6 bg-base-100 text-sm text-base-content/70 space-y-2">
                        <p>
                            <b>{accountType === 'organization' ? 'Название организации' : 'Имя'}:</b>{' '}
                            {formData.name ||
                                (accountType === 'organization'
                                    ? 'ОсОО Здоровье+'
                                    : accountType === 'specialist'
                                        ? 'Айдана М.'
                                        : 'Айдана')}
                        </p>

                        <p><b>Email:</b> {formData.email || 'example@mail.com'}</p>
                        <p><b>Телефон:</b> {formData.phone || '+996 700 123 456'}</p>

                        {formStep === 2 && (
                            <>
                                <p><b>Логин:</b> {formData.username || 'aida2025'}</p>
                                <p><b>Пароль:</b> ••••••••••</p>

                                {accountType === 'specialist' && (
                                    <>
                                        <p><b>Опыт:</b> {formData.experienceYears || '3'} года</p>
                                        <p><b>О себе:</b> {formData.about || 'Врач-реабилитолог. Работаю с травмами опорно-двигательного аппарата.'}</p>
                                    </>
                                )}

                                {accountType === 'organization' && (
                                    <>
                                        <p><b>Сайт:</b> {formData.website || 'https://zdorovie-plus.kg'}</p>
                                        <p><b>Адрес:</b> {formData.address || 'г. Бишкек, ул. Медицинская, 10'}</p>
                                        <p><b>О нас:</b> {formData.about || 'Наша клиника оказывает профессиональные медицинские услуги с заботой о каждом пациенте.'}</p>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );

};

export default StepForm;
