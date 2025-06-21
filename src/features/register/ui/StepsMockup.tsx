import type { StepFormData, AccountType } from '../types/StepForm.ts';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface StepsMockupProps {
    formStep: 1 | 2 | 3;
    formData: StepFormData;
    accountType: AccountType | null;
}

export const StepsMockup = ({ formStep, accountType }: StepsMockupProps) => (
    <div className="flex items-center justify-center h-full pl-7">
        <div className="mockup-window border bg-base-300 scale-100 max-w-lg rounded-xl shadow-md">
            <div className="px-6 py-5 bg-base-100 text-sm text-base-content/80 space-y-4">
                <div className="flex items-center gap-2 text-info">
                    <InformationCircleIcon className="w-5 h-5" />
                    <span className="font-semibold">Пример заполнения</span>
                </div>

                {formStep === 1 && (
                    <div className="space-y-1 italic opacity-80">
                        <p><b>{accountType === 'organization' ? 'Название организации' : 'Имя'}:</b> Текст </p>
                        <p><b>Email:</b> example@mail.com</p>
                        <p><b>Телефон:</b> +996 700 123 456</p>
                    </div>
                )}

                {formStep === 2 && (
                    <div className="space-y-1 italic opacity-80">
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
                    </div>
                )}

                {formStep === 3 && (
                    <div className="space-y-3 italic opacity-80">
                        <div className="alert alert-info text-xs p-3 mt-2">
                            Загрузите чёткую фотографию лица (для специалистов) или логотип вашей организации. Это поможет пользователям быстрее вас узнать.
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);
