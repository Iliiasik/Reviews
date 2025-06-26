import axios from 'axios';

export const updateProfile = async (data: any): Promise<any> => {
    try {
        const response = await axios.post('/api/profile/update', data, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Ошибка обновления профиля');
    }
};

export const fetchProfile = async (): Promise<any> => {
    try {
        const response = await axios.get('/api/profile', { withCredentials: true });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Ошибка загрузки профиля');
    }
};
