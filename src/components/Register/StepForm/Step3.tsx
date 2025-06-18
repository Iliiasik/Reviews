import type {ChangeEvent} from 'react';

interface Step3Props {
    avatarPreview: string | null;
    handleAvatarChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBack: () => void;
}

export const Step3 = ({ avatarPreview, handleAvatarChange, onBack }: Step3Props) => (
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
                onChange={handleAvatarChange}
            />
        </div>

        {avatarPreview && (
            <div className="mt-4 flex justify-center">
                <div className="avatar">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={avatarPreview} alt="Аватар превью" />
                    </div>
                </div>
            </div>
        )}

        <div className="flex justify-between gap-4 mt-4">
            <button type="button" className="btn w-1/2" onClick={onBack}>Назад</button>
            <button type="submit" className="btn btn-primary w-1/2">Зарегистрироваться</button>
        </div>

        <p className="text-center mt-2 text-sm">
            <button type="submit" className="link link-primary">Пропустить загрузку фото</button>
        </p>
    </>
);
