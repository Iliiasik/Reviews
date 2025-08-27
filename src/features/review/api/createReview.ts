import api from "@shared/axios/axios.ts";

interface CreateReviewPayload {
    profile_user_id: number;
    rating: number;
    text: string;
    is_anonymous: boolean;
    pros: number[];
    cons: number[];
}

export const createReview = async (data: CreateReviewPayload) => {
    const response = await api.post('/reviews', data);
    return response.data;
};

