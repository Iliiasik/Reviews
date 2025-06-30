export class LoginError extends Error {
    code?: string;

    constructor(message: string, code?: string) {
        super(message);
        this.name = 'LoginError';
        this.code = code;
    }
}

export const login = async (credentials: { username: string; password: string }) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new LoginError(error.message || 'Ошибка авторизации', error.error_code);
    }

    return response.json();
};
