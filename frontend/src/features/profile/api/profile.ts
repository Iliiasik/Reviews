import api from '@shared/axios/axios';

export const updateProfile = async (data: any): Promise<any> => {
    try {
        const response = await api.post('/profile/update', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка обновления профиля');
    }
};

export const fetchProfile = async (): Promise<any> => {
    try {
        const response = await api.get('/profile');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка загрузки профиля');
    }
};
