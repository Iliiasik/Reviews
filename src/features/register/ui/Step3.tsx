import type {ChangeEvent} from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

interface Step3Props {
    avatarPreview: string | null;
    handleAvatarChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBack: () => void;
    loading?: boolean;
}

export const Step3 = ({ avatarPreview, handleAvatarChange, onBack, loading }: Step3Props) => {
    return (
        <>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Фото профиля</span>
                </label>

                <div className="flex flex-col items-center">
                    <label className="cursor-pointer">
                        <div className="avatar">
                            <div className="w-24 h-24 rounded-full ring-2 ring-primary flex items-center justify-center overflow-hidden">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Аватар превью"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full">
                                        <ArrowUpIcon className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <input
                            type="file"
                            name="avatar"
                            accept="image/jpeg,image/png"
                            className="hidden"
                            onChange={handleAvatarChange}
                            disabled={loading}
                        />
                    </label>
                    <span className="text-sm text-gray-500 mt-2">
                        Поддерживаемые форматы: JPG, PNG
                    </span>
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
                <button
                    type="button"
                    className="btn"
                    onClick={onBack}
                    disabled={loading}
                >
                    Назад
                </button>

                <button
                    type="submit"
                    className="btn btn-primary flex items-center justify-center gap-2"
                    disabled={loading}
                >
                    {loading && (
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                        </svg>
                    )}
                    Зарегистрироваться
                </button>
            </div>
        </>
    );
};