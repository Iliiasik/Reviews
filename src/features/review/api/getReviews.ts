import api from "@shared/axios/axios.ts";

export const getReviews = async (profileUserId: string) => {
    const response = await api.get('/reviews', {
        params: { profile_user_id: profileUserId }
    });
    return response.data.map((review: any) => ({
        ...review,
        usefulCount: review.useful_count,
        userHasLiked: review.user_has_liked,
    }));
};
