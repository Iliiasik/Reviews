interface RegisterPayload {
    username: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    account_type: 'user' | 'specialist' | 'organization';
    experience_years?: number;
    about?: string;
    website?: string;
    address?: string;
}

interface RegisterResponse {
    token: string;
    user: {
        id: string;
        username: string;
        account_type: string;
    };
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