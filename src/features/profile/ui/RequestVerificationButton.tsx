import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { useVerificationRequest } from '../model/useVerificationRequest';

interface RequestVerificationButtonProps {
    userType: 'specialist' | 'organization';
    isConfirmed: boolean;
}

export const RequestVerificationButton = ({
                                              userType,
                                              isConfirmed
                                          }: RequestVerificationButtonProps) => {
    const { submitRequest, isLoading } = useVerificationRequest();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (description.trim()) {
            const success = await submitRequest(description);
            if (success) {
                setIsModalOpen(false);
                setDescription('');
            }
        }
    };

    if (isConfirmed) return null;

    return (
        <>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-base-300">
                <p className="text-sm text-warning flex-grow">
                    Ваш {userType === 'specialist' ? 'профиль' : 'организация'} не подтвержден, оставьте заявку на подтверждение
                </p>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-sm btn-primary"
                >
                    <FiSend className="mr-2" />
                    Запросить
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-base-100/70 backdrop-blur-md p-6 rounded-2xl w-full max-w-md shadow-xl border border-base-200 border-opacity-40">
                        <h3 className="text-xl font-bold mb-4">
                            {userType === 'specialist'
                                ? 'Заявка на подтверждение статуса'
                                : 'Подтверждение организации'}
                        </h3>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                  <span className="label-text font-semibold">
                    {userType === 'specialist'
                        ? 'Опишите ваш опыт и квалификацию'
                        : 'Опишите деятельность организации'}
                  </span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full h-32 opacity-75"
                                    placeholder="Введите описание..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    className="btn btn-ghost bg-opacity-5 hover:bg-opacity-10"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isLoading}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="btn bg-opacity-10 hover:bg-opacity-20"
                                    disabled={isLoading || !description.trim()}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      Отправка...
                    </span>
                                    ) : 'Отправить'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};