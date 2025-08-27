export interface Review {
    id: number;
    rating: number;
    text: string;
    is_anonymous: boolean;
    is_frozen: boolean;
    created_at: string;
    updated_at: string;
    author?: {
        id: number;
        name: string;
        avatar_url?: string | null;
    };
    profile_user: {
        id: number;
        name: string;
        avatar_url?: string | null;
    };
    pros: ReviewAspect[];
    cons: ReviewAspect[];
}

export interface ReviewAspect {
    id: number;
    description: string;
    positive: boolean;
}

export interface ReviewsSummary {
    total_reviews: number;
    user_reviews_count: number;
    rating: number;
    pros_count: Array<{
        id: number;
        description: string;
        count: number;
    }>;
    cons_count: Array<{
        id: number;
        description: string;
        count: number;
    }>;
}