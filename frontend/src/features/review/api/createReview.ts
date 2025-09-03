import api from "@shared/axios/axios"
import type { CreateReviewPayload } from "@features/review/types/Review"

export const createReview = async (data: CreateReviewPayload) => {
    const response = await api.post("/reviews", data)
    return response.data
}
