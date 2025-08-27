import api from '@shared/axios/axios.ts';

export const resendConfirmationEmail = async (username: string) => {
    try {
        await api.post('/resend-confirmation', { username });
    } catch {
        throw new Error('Не удалось отправить письмо');
    }
};
