import axios from "axios";
import type {SpecialistProfile} from "@features/specialist/types/SpecialistProfile";

export const getSpecialistById = (id: string | number): Promise<SpecialistProfile> => {
    return axios.get(`/api/specialist/${id}`).then(res => res.data);
};
