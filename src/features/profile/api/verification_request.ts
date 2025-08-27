import api from '@shared/axios/axios';

interface VerificationRequestStatus {
    hasPendingRequest: boolean;
}

export const VerificationRequestApi = {
    create: async (description: string) => {
        const response = await api.post('/verification-requests', { description });
        return response.data;
    },

    checkStatus: async (): Promise<VerificationRequestStatus> => {
        const response = await api.get('/verification-requests/status');
        return response.data;
    },
};