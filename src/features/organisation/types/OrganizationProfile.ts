// features/organization/types/OrganizationProfile.ts
export interface OrganizationProfile {
    id: number;
    name: string;
    avatar_url: string;
    rating: number;
    website: string;
    address: string;
    about: string;
    is_confirmed: boolean;
}
