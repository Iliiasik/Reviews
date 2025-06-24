import axios from "axios";
import type {ReviewAspect} from "../types/ReviewAspect.ts";

export const getReviewAspects = (): Promise<ReviewAspect[]> => {
    return axios.get("/api/aspects").then(res => res.data);
};
