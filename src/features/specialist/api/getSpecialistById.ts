import axios from "axios";
import type {SpecialistProfile} from "@features/specialist/types/SpecialistProfile";

export const getSpecialistById = async (id: string | number): Promise<SpecialistProfile> => {
    const [profileRes, summaryRes] = await Promise.all([
        axios.get(`/api/specialist/${id}`),
        axios.get(`/api/reviews/summary/${id}`)
    ]);

    return {
        ...profileRes.data,
        total_reviews: summaryRes.data.data.total_reviews,
        pros_count: summaryRes.data.data.pros_count,
        cons_count: summaryRes.data.data.cons_count,
    };
};
