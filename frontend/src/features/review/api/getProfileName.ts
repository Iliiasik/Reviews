import api from "@shared/axios/axios";

export const getProfileName = async (type: "organization" | "specialist", id: string) => {
    const res = await api.get(`/${type}/${id}`);
    return res.data.name as string;
};
