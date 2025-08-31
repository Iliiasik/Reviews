import api from "@shared/axios/axios";
import type { TeamMember } from "../types/TeamMember";

export const getTeam = async (): Promise<TeamMember[]> => {
    const res = await api.get("/team");
    return res.data;
};
