import api from "@shared/axios/axios";
import type { ContactRequest } from "../types/ContactRequest";

export const sendContactRequest = async (data: ContactRequest) => {
    try {
        const response = await api.post("/contact", data);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Ошибка отправки запроса");
    }
};
