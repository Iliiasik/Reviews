import { useEditProfile } from '@features/profile/model/useEditProfile';
import { IMaskInput } from 'react-imask';

interface EditProfileModalProps {
    profile: any;
    onClose: () => void;
    onSuccess: () => void;
}

export const EditProfileModal = ({ profile, onClose, onSuccess }: EditProfileModalProps) => {
    const {
        form,
        errors,
        error,
        loading,
        handleChange,
        handleNumberChange,
        handleSubmit,
    } = useEditProfile(profile, onSuccess);

    const renderField = (
        name: string,
        label: string,
        type = 'text',
        placeholder = '',
        isTextarea = false,
        isNumber = false,
        isPhone = false
    ) => {
        const value = form[name as keyof typeof form];
        const error = errors[name];

        if (isPhone) {
            return (
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">{label}</span>
                    </label>
                    <IMaskInput
                        mask={'+996 (000)-00-00-00'}
                        value={value as string}
                        unmask={false}
                        onAccept={(value: string) => {
                            handleChange({
                                target: { name, value },
                            } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        placeholder="+996 (XXX)-XX-XX-XX"
                        type="tel"
                        name={name}
                        className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
                    />
                    {error && <span className="text-error text-sm mt-1">{error}</span>}
                </div>
            );
        }

        return (
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">{label}</span>
                </label>
                {isTextarea ? (
                    <textarea
                        name={name}
                        value={value as string}
                        onChange={handleChange}
                        className={`textarea textarea-bordered w-full ${error ? 'textarea-error' : ''}`}
                        placeholder={placeholder}
                        rows={4}
                    />
                ) : (
                    <input
                        name={name}
                        type={type}
                        value={value as string}
                        onChange={isNumber ? handleNumberChange : handleChange}
                        className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
                        placeholder={placeholder}
                    />
                )}
                {error && <span className="text-error text-sm mt-1">{error}</span>}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-base-100/70 backdrop-blur-md p-6 rounded-2xl w-full max-w-md shadow-xl border border-base-200 border-opacity-40">
                <h3 className="text-xl font-bold mb-4">Редактирование профиля</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {renderField('name', 'Имя / Название', 'text', 'Имя / Название')}
                    {renderField('email', 'Email', 'email', 'Email')}
                    {renderField('phone', 'Телефон', 'tel', 'Телефон', false, false, true)}

                    {(form.role === 'specialist' || form.role === 'organization') &&
                        renderField(
                            'about',
                            form.role === 'specialist' ? 'О себе' : 'О нас',
                            'text',
                            form.role === 'specialist' ? 'О себе' : 'О нас',
                            true
                        )
                    }

                    {form.role === 'organization' && (
                        <>
                            {renderField('website', 'Сайт', 'url', 'Сайт')}
                            {renderField('address', 'Адрес', 'text', 'Адрес')}
                        </>
                    )}

                    {form.role === 'specialist' &&
                        renderField('experience_years', 'Опыт (лет)', 'number', 'Опыт (лет)', false, true)
                    }

                    {error && <div className="text-error text-sm">{error}</div>}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            className="btn btn-ghost bg-opacity-5 hover:bg-opacity-10"
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="btn bg-opacity-10 hover:bg-opacity-20"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Сохраняем...
                                </span>
                            ) : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};