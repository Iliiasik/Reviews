export interface AspectCount {
    id: number;
    description: string;
    count: number;
}

export interface SpecialistProfile {
    id: number;
    name: string;
    avatar_url: string;
    rating: number;
    about: string;
    experience_years: number;
    is_confirmed: boolean;

    total_reviews?: number;
    pros_count?: AspectCount[];
    cons_count?: AspectCount[];
}
