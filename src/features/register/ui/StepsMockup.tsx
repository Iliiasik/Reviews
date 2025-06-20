import type {StepFormData, AccountType} from '../types/StepForm.ts';

interface StepsMockupProps {
    formStep: 1 | 2 | 3;
    formData: StepFormData;
    accountType: AccountType | null;
}

export const StepsMockup = ({ formStep, formData, accountType }: StepsMockupProps) => (
    <div className="flex items-center justify-center h-full px-2">
        <div className="mockup-window border bg-base-300 scale-95 max-w-sm rounded-xl shadow-md">
            <div className="px-4 py-4 bg-base-100 text-sm text-base-content/80 space-y-2">
                {formStep === 1 && (
                    <>
                        <p><b>{accountType === 'organization' ? 'Название организации' : 'Имя'}:</b> Айдана</p>
                        <p><b>Email:</b> example@mail.com</p>
                        <p><b>Телефон:</b> +996 700 123 456</p>
                    </>
                )}

                {formStep === 2 && (
                    <>
                        <p><b>Логин:</b> aida2025</p>
                        <p><b>Пароль:</b> ••••••••••</p>

                        {accountType === 'specialist' && (
                            <>
                                <p><b>Опыт:</b> 3 года</p>
                                <p><b>О себе:</b> Врач-реабилитолог...</p>
                            </>
                        )}

                        {accountType === 'organization' && (
                            <>
                                <p><b>Сайт:</b> https://zdorovie-plus.kg</p>
                                <p><b>Адрес:</b> г. Бишкек, ул. Медицинская, 10</p>
                                <p><b>О нас:</b> Оказываем медицинские услуги с заботой.</p>
                            </>
                        )}
                    </>
                )}

                {formStep === 3 && (
                    <div className="flex flex-col items-start space-y-2">
                        <div className="w-8 h-8">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full text-base-content/60"
                            >
                                <path
                                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>
                        <div className="space-y-1 text-sm">
                            <p><b>Имя:</b> {formData.name || 'Текст'}</p>
                            <p><b>Email:</b> {formData.email || 'example@mail.com'}</p>
                            <p><b>Телефон:</b> {formData.phone || '+996 700 123 456'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);
