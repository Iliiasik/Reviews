import api from '@shared/axios/axios';

export const createReview = async (data: {
    profile_user_id: number;
    rating: number;
    text: string;
    is_anonymous: boolean;
    pros: number[];
    cons: number[];
}) => {
    return api.post('/reviews', data);
};
