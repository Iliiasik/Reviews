import api from "@shared/axios/axios.ts";

interface GetReviewsOptions {
    limit?: number;
    offset?: number;
    sort?: "newest" | "oldest";
}

export const getReviews = async (profileUserId: string, options: GetReviewsOptions = {}) => {
    const response = await api.get('/reviews', {
        params: {
            profile_user_id: profileUserId,
            limit: options.limit,
            offset: options.offset,
            sort: options.sort,
        }
    });

    return response.data.map((review: any) => ({
        ...review,
        usefulCount: review.useful_count,
        userHasLiked: review.user_has_liked,
    }));
};
