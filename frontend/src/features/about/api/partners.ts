import api from "@shared/axios/axios";
import type { Partner } from "../types/Partner";

export const getPartners = async (): Promise<Partner[]> => {
    const res = await api.get("/partners");
    return res.data;
};
