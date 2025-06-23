export const uploadAvatar = async (
    userId: string,
    accountType: 'user' | 'specialist' | 'organization',
    file: File
): Promise<void> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`/api/avatar/${userId}?account_type=${accountType}`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка загрузки аватара');
    }
};