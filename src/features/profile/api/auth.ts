import api from '@shared/axios/axios';

export const changePassword = async (data: {
    current_password: string;
    new_password: string;
}) => {
    try {
        const response = await api.post('/change-password', data);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Произошла ошибка при смене пароля');
    }
};
