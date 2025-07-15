// @features/review/api/likeReview.ts
import api from "@shared/axios/axios.ts";

export const likeReview = async (reviewId: number) => {
    const response = await api.post(`/reviews/${reviewId}/like`);
    return response.data;
};
