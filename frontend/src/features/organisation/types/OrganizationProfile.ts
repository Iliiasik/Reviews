export interface AspectCount {
    id: number;
    description: string;
    count: number;
}

export interface OrganizationProfile {
    id: number;
    name: string;
    avatar_url: string;
    rating: number;
    website: string;
    address: string;
    about: string;
    is_confirmed: boolean;

    total_reviews?: number;
    pros_count?: AspectCount[];
    cons_count?: AspectCount[];
}
