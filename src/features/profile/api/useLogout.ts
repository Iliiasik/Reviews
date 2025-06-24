import { useUser } from "@shared/context/UserContext";
import axios from "axios";

export const useLogout = () => {
    const { setUser } = useUser();

    const logout = async (): Promise<void> => {
        try {
            await axios.post("/api/logout", {}, { withCredentials: true });
            setUser(null); // обнуляем пользователя в контексте
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || "Ошибка выхода");
            }
            throw new Error("Неизвестная ошибка при выходе");
        }
    };

    return logout;
};
