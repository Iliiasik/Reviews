import api from '@shared/axios/axios';

export const VerificationRequestApi = {
    create: async (description: string) => {
        const response = await api.post('/verification-requests', { description });
        return response.data;
    },
};