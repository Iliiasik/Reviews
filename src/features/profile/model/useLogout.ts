import { useUser } from "@shared/context/UserContext";
import api from "@shared/axios/axios";
import axios from "axios";

export const useLogout = () => {
    const { setUser } = useUser();

    const logout = async (): Promise<void> => {
        try {
            await api.post("/logout");
            setUser(null);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Ошибка выхода");
            }
            throw new Error("Неизвестная ошибка при выходе");
        }
    };

    return logout;
};
