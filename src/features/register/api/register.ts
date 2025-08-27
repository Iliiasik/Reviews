import api from '@shared/axios/axios';

export interface RegisterResponse {
    message: string;
    user_id: number;
}

export const register = async (data: object): Promise<RegisterResponse> => {
    try {
        const response = await api.post<RegisterResponse>('/register', data);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Ошибка регистрации');
    }
};
