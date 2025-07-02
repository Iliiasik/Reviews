import type {ReviewAspect} from "../types/ReviewAspect.ts";
import api from "@shared/axios/axios.ts";

export const getReviewAspects = (): Promise<ReviewAspect[]> => {
    return api.get("/aspects").then(res => res.data);
};
