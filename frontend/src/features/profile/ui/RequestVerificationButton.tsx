import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { BsPatchCheckFill, BsHourglassSplit } from 'react-icons/bs';
import { useVerificationRequest } from '../model/useVerificationRequest';

interface RequestVerificationButtonProps {
    userType: 'specialist' | 'organization';
    isConfirmed: boolean;
}

export const RequestVerificationButton = ({
                                              userType,
                                              isConfirmed
                                          }: RequestVerificationButtonProps) => {
    const { statusLoading, hasPendingRequest, submitRequest, isLoading, errors } = useVerificationRequest();
    const [isInputOpen, setIsInputOpen] = useState(false);
    const [description, setDescription] = useState('');

    const handleSend = async () => {
        const success = await submitRequest(description);
        if (success) {
            setDescription('');
            setIsInputOpen(false);
        }
    };

    return (
        <div className="mt-4 min-h-[1.5rem] flex flex-col gap-2">
            {statusLoading ? (
                <div className="flex justify-center items-center w-full">
                    <span className="loading loading-spinner loading-sm text-base-content/40"></span>
                </div>
            ) : isConfirmed ? (
                <div className="flex items-center gap-2">
                    <BsPatchCheckFill className="text-blue-500 text-lg" />
                    <span className="text-sm font-medium text-blue-600">
                        Ваш {userType === 'specialist' ? 'профиль специалиста' : 'аккаунт организации'} подтверждён
                    </span>
                </div>
            ) : hasPendingRequest ? (
                <div className="flex items-center gap-2">
                    <BsHourglassSplit className="text-yellow-500 text-lg" />
                    <span className="text-sm font-medium text-yellow-600">
                        Ваша заявка на рассмотрении
                    </span>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-3 w-full pt-4 border-t border-base-300">
                        <p className="text-sm text-warning flex-grow">
                            Ваш {userType === 'specialist' ? 'профиль' : 'организация'} не подтвержден, оставьте заявку на подтверждение
                        </p>
                        {!isInputOpen && (
                            <button
                                onClick={() => setIsInputOpen(true)}
                                className="btn btn-sm btn-primary flex items-center gap-2"
                            >
                                <FiSend />
                                Запросить
                            </button>
                        )}
                    </div>

                    {isInputOpen && (
                        <div className="mt-2 flex flex-col gap-1 transition-all duration-300">
                            <input
                                type="text"
                                className={`input input-bordered w-full h-12 ${errors.description ? 'input-error' : 'opacity-75'}`}
                                placeholder={userType === 'specialist'
                                    ? 'Опишите ваш опыт и квалификацию'
                                    : 'Опишите деятельность организации'}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isLoading}
                            />
                            {errors.description && (
                                <span className="text-error text-sm mt-1">{errors.description}</span>
                            )}
                            <button
                                onClick={handleSend}
                                className="btn btn-sm btn-primary self-end"
                                disabled={isLoading || !description.trim()}
                            >
                                {isLoading ? 'Отправка...' : 'Отправить'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
