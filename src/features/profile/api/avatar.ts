import api from '@shared/axios/axios';

export interface AvatarUploadResponse {
    message: string;
    avatar_url: string;
}

export const uploadAvatar = async (
    userId: number,
    accountType: 'user' | 'specialist' | 'organization',
    file: File
): Promise<AvatarUploadResponse> => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const response = await api.post<AvatarUploadResponse>(
            `/users/${userId}/avatar?account_type=${accountType}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Ошибка загрузки аватара');
    }
};

export const deleteAvatar = async (
    userId: number,
    accountType: 'user' | 'specialist' | 'organization'
): Promise<void> => {
    try {
        await api.delete(`/users/${userId}/avatar?account_type=${accountType}`);
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Ошибка удаления аватара');
    }
};