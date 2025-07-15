
import api from "@shared/axios/axios.ts";

export const unlikeReview = async (reviewId: number) => {
    return api.delete(`/reviews/${reviewId}/like`);
};
