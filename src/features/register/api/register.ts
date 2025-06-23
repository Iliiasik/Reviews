export interface RegisterResponse {
    message: string;
    user_id: number;
    avatar_url?: string;
}

export const register = async (formData: FormData): Promise<RegisterResponse> => {
    const response = await fetch('/api/register', {
        method: 'POST',
        body: formData,
        // Не устанавливаем Content-Type вручную - браузер сам добавит с boundary
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка регистрации');
    }

    return response.json();
};