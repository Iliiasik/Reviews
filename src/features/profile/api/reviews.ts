import api from '@shared/axios/axios';

export const ReviewsApi = {
    getUserReviews: async (page: number = 1, limit: number = 6, role?: string) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (role) params.append('role', role);

        const response = await api.get('/reviews/user', { params });
        return response.data;
    },

    getSummary: async (userId: number) => {
        const response = await api.get(`/reviews/summary/${userId}`);
        return response.data.data;
    },
};