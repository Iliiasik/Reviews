import axios from "axios";

interface CreateReviewPayload {
    profile_user_id: number;
    rating: number;
    text: string;
    is_anonymous: boolean;
    pros: number[];
    cons: number[];
}

export const createReview = async (data: CreateReviewPayload) => {
    const response = await axios.post("/api/reviews", data, {
        withCredentials: true,
    });
    return response.data;
};

