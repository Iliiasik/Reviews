import { useState } from 'react';
import * as yup from 'yup';
import { uploadAvatar, deleteAvatar } from '../api/avatar';
import { useToast } from '@shared/context/ToastContext';

const avatarSchema = yup.object().shape({
    file: yup
        .mixed<File>()
        .required('Файл обязателен')
        .test('fileType', 'Пожалуйста, выберите изображение (JPEG, PNG)', (file) => {
            return !!file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
        })
        .test('fileSize', 'Размер файла не должен превышать 5MB', (file) => {
            return !!file && file.size <= 5 * 1024 * 1024;
        }),
});

export const useAvatarActions = (
    userId: number,
    accountType: 'user' | 'specialist' | 'organization'
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    const upload = async (file: File) => {
        setIsLoading(true);
        setError(null);

        try {
            await avatarSchema.validate({ file });
            const response = await uploadAvatar(userId, accountType, file);
            showToast('Аватар успешно обновлён', 'success');
            return response;
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const remove = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            await deleteAvatar(userId, accountType);
            showToast('Аватар успешно удалён', 'success');
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setIsDeleting(false);
        }
    };

    const handleError = (err: unknown) => {
        const message = err instanceof yup.ValidationError
            ? err.message
            : err instanceof Error
                ? err.message
                : 'Неизвестная ошибка';

        setError(message);
        showToast(message, 'error');
    };

    return {
        upload,
        remove,
        isLoading,
        isDeleting,
        error
    };
};