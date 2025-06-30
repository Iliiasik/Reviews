import type { StepFormData, AccountType } from '../types/StepForm.ts';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface StepsMockupProps {
    formStep: 1 | 2;
    formData: StepFormData;
    accountType: AccountType | null;
}

export const StepsMockup = ({ formStep, accountType }: StepsMockupProps) => (
    <div className="flex items-center justify-center h-full pl-7">
        <div className="mockup-window border border-base-200 bg-base-100 max-w-lg rounded-box shadow-lg">
            <div className="px-6 py-5 bg-base-100 text-base-content">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-info/10 text-info">
                        <InformationCircleIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Рекомендации по заполнению</h3>
                        <p className="text-sm opacity-75">{formStep === 1 ? 'Контактные данные' : 'Настройки учетной записи'}</p>
                    </div>
                </div>

                <div className="divider my-2"></div>

                {formStep === 1 && (
                    <div className="space-y-3">

                        <div className="bg-base-200 rounded-box p-4 space-y-2">
                            <div className="flex gap-2 items-start">
                                <span className="badge badge-info badge-xs mt-1"></span>
                                <div>
                                    <p className="font-medium">{accountType === 'organization' ? 'Название организации' : 'Полное имя'}</p>
                                    <p className="text-xs opacity-70">Укажите официальное наименование или полное ФИО</p>
                                </div>
                            </div>

                            <div className="flex gap-2 items-start">
                                <span className="badge badge-info badge-xs mt-1"></span>
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-xs opacity-70">Используйте действующий адрес электронной почты</p>
                                </div>
                            </div>

                            <div className="flex gap-2 items-start">
                                <span className="badge badge-info badge-xs mt-1"></span>
                                <div>
                                    <p className="font-medium">Телефон</p>
                                    <p className="text-xs opacity-70">Международный формат: +7 (XXX) XXX-XX-XX</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {formStep === 2 && (
                    <div className="space-y-3">

                        <div className="bg-base-200 rounded-box p-4 space-y-2">
                            <div className="flex gap-2 items-start">
                                <span className="badge badge-info badge-xs mt-1"></span>
                                <div>
                                    <p className="font-medium">Логин</p>
                                    <p className="text-xs opacity-70">Уникальное имя пользователя (латинские буквы и цифры)</p>
                                </div>
                            </div>

                            <div className="flex gap-2 items-start">
                                <span className="badge badge-info badge-xs mt-1"></span>
                                <div>
                                    <p className="font-medium">Пароль</p>
                                    <p className="text-xs opacity-70">Минимум 8 символов, включая буквы и цифры</p>
                                </div>
                            </div>

                            {accountType === 'specialist' && (
                                <>
                                    <div className="flex gap-2 items-start">
                                        <span className="badge badge-info badge-xs mt-1"></span>
                                        <div>
                                            <p className="font-medium">Опыт работы</p>
                                            <p className="text-xs opacity-70">Укажите ваш профессиональный стаж в годах</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 items-start">
                                        <span className="badge badge-info badge-xs mt-1"></span>
                                        <div>
                                            <p className="font-medium">О себе</p>
                                            <p className="text-xs opacity-70">Краткое профессиональное описание (макс. 200 символов)</p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {accountType === 'organization' && (
                                <>
                                    <div className="flex gap-2 items-start">
                                        <span className="badge badge-info badge-xs mt-1"></span>
                                        <div>
                                            <p className="font-medium">Веб-сайт</p>
                                            <p className="text-xs opacity-70">Полный URL (например, https://вашакомпания.ру)</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 items-start">
                                        <span className="badge badge-info badge-xs mt-1"></span>
                                        <div>
                                            <p className="font-medium">Юридический адрес</p>
                                            <p className="text-xs opacity-70">Фактическое местоположение организации</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 items-start">
                                        <span className="badge badge-info badge-xs mt-1"></span>
                                        <div>
                                            <p className="font-medium">Описание деятельности</p>
                                            <p className="text-xs opacity-70">Кратко опишите сферу деятельности (макс. 300 символов)</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);