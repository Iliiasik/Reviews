interface AvatarUploadResponse {
    upload_url: string;
    avatar_url: string;
    error?: string;
}

export const uploadAvatar = async (
    userId: string,
    accountType: 'user' | 'specialist' | 'organization',
    file: File
): Promise<AvatarUploadResponse> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`/api/avatar/${userId}?account_type=${accountType}`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при загрузке аватара');
    }

    return response.json();
};