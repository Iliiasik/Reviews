export interface CreateReviewPayload {
    profile_user_id: number
    rating: number
    text?: string
    is_anonymous: boolean
    pros: number[]
    cons: number[]
}
