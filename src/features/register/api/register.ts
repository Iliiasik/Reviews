export interface RegisterPayload {
    username: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    account_type: 'user' | 'specialist' | 'organization';
    avatar_ext?: string;
    experience_years?: number;
    about?: string;
    website?: string;
    address?: string;
}

export interface RegisterResponse {
    token: string;
    user: {
        id: string;
        username: string;
        account_type: string;
    };
    message?: string;
}

export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка регистрации');
    }

    return response.json();
};