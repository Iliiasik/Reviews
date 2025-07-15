import api from '@shared/axios/axios';

export const ReviewsApi = {
    getUserReviews: async () => {
        const response = await api.get('/reviews/user');
        return response.data;
    },

    getSummary: async (userId: number) => {
        const response = await api.get(`/reviews/summary/${userId}`);
        return response.data.data;
    },
};