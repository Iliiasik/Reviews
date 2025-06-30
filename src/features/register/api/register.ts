export interface RegisterResponse {
    message: string;
    user_id: number;
}

export const register = async (data: object): Promise<RegisterResponse> => {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка регистрации');
    }

    return response.json();
};