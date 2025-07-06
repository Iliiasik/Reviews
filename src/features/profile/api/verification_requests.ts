import api from '@shared/axios/axios';

export const VerificationRequestsApi = {
    getPending: async () => {
        const response = await api.get('/verification-requests/pending');
        return response.data.data;
    },

    approve: async (id: number) => {
        const response = await api.post(`/verification-requests/${id}/approve`);
        return response.data;
    },

    reject: async (id: number) => {
        const response = await api.post(`/verification-requests/${id}/reject`);
        return response.data;
    },
};

export const VerificationRequestApi = {
    create: async (description: string) => {
        const response = await api.post('/verification-requests', { description });
        return response.data;
    },
};