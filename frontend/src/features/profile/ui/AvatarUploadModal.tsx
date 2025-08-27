import { useState, useRef, type ChangeEvent } from 'react';
import { CheckCircleIcon, ArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAvatarActions } from '../model/useAvatarActions';

interface AvatarUploadModalProps {
    userId: number;
    accountType: 'user' | 'specialist' | 'organization';
    currentAvatarUrl?: string;
    onClose: () => void;
    onSuccess?: (avatarUrl: string) => void;
    onDelete?: () => void;
}

export const AvatarUploadModal = ({
                                      userId,
                                      accountType,
                                      currentAvatarUrl,
                                      onClose,
                                      onSuccess,
                                      onDelete
                                  }: AvatarUploadModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { upload, remove, isLoading, isDeleting } = useAvatarActions(userId, accountType);

    const hasAvatar = !!previewUrl || !!currentAvatarUrl;
    const showDeleteButton = !!currentAvatarUrl && !selectedFile;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;
        const response = await upload(selectedFile);
        onSuccess?.(response.avatar_url);
        onClose();
    };

    const handleDelete = async () => {
        await remove();
        onDelete?.();
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-base-100/70 backdrop-blur-md p-6 rounded-2xl w-full max-w-md shadow-xl border border-base-200 border-opacity-40 flex flex-col relative">
                {showDeleteButton && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="btn btn-sm btn-ghost absolute top-2 right-4 text-error hover:bg-error/10"
                    >
                        {isDeleting ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <TrashIcon className="w-5 h-5" />
                        )}
                    </button>
                )}

                <h3 className="text-xl font-bold mb-4">Загрузка аватара</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center gap-4 relative">
                        <div
                            className="tooltip tooltip-bottom"
                            data-tip={hasAvatar ? "Изменить аватар" : "Добавить аватар"}
                        >
                            <label className="cursor-pointer" onClick={handleUploadClick}>
                                <div className="avatar">
                                    <div className="w-28 h-28 rounded-full ring-2 ring-primary flex items-center justify-center overflow-hidden">
                                        {hasAvatar ? (
                                            <img
                                                src={previewUrl || currentAvatarUrl}
                                                alt="Аватар"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full">
                                                <ArrowUpIcon className="h-14 w-14 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </label>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/jpeg,image/png"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <span className="text-sm text-gray-500 mt-2">
                            Поддерживаемые форматы: JPG, PNG
                        </span>

                        {selectedFile && (
                            <div className="flex items-center gap-2 text-success text-sm">
                                <CheckCircleIcon className="w-4 h-4" />
                                <span>Файл выбран</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={onClose}
                            disabled={isLoading || isDeleting}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading || isDeleting || !selectedFile}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Загружаем...
                                </span>
                            ) : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
