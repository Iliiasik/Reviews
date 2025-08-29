import api from "@shared/axios/axios";
import type { OrganizationProfile } from "../types/OrganizationProfile";

export const getOrganizationById = async (id: string | number): Promise<OrganizationProfile> => {
    const [profileRes, summaryRes] = await Promise.all([
        api.get(`/organization/${id}`),
        api.get(`/reviews/summary/${id}`)
    ]);

    return {
        ...profileRes.data,
        total_reviews: summaryRes.data.data.total_reviews,
        pros_count: summaryRes.data.data.pros_count,
        cons_count: summaryRes.data.data.cons_count,
    };
};
