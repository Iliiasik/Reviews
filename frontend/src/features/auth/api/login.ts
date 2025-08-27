import api from '@shared/axios/axios.ts';

export class LoginError extends Error {
    code?: string;

    constructor(message: string, code?: string) {
        super(message);
        this.name = 'LoginError';
        this.code = code;
    }
}

export const login = async (credentials: { username: string; password: string }) => {
    try {
        const response = await api.post('/login', credentials);
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            const data = error.response.data;
            throw new LoginError(data.message || 'Ошибка авторизации', data.error_code);
        }
        throw error;
    }
};
