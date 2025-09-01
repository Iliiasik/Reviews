import { useState, useEffect } from "react";
import * as yup from "yup";
import type { ContactRequest } from "../types/ContactRequest";
import { sendContactRequest } from "../api/contact_request";
import { useToast } from "@shared/context/ToastContext";

const contactSchema = yup.object().shape({
    Name: yup.string().required("Имя обязательно").min(2, "Минимум 2 символа").max(100, "Максимум 100 символов"),
    Email: yup.string().required("Email обязателен").email("Неверный формат email"),
    Description: yup.string().required("Описание обязательно").min(10, "Минимум 10 символов").max(1000, "Максимум 1000 символов"),
});

const LAST_SUBMIT_KEY = "contact_last_submit";
const COOLDOWN_MS = 1000 * 60 * 60;

export const useContactForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [canSubmit, setCanSubmit] = useState(true);
    const [timer, setTimer] = useState(0);
    const toast = useToast();

    useEffect(() => {
        const lastSubmit = Number(localStorage.getItem(LAST_SUBMIT_KEY) || 0);
        const remaining = COOLDOWN_MS - (Date.now() - lastSubmit);
        if (remaining > 0) {
            setCanSubmit(false);
            setTimer(Math.ceil(remaining / 1000));
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setCanSubmit(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, []);

    const handleSubmit = async (data: ContactRequest) => {
        if (!canSubmit) {
            toast.showToast(`Подождите ${formatTimer(timer)} перед повторной отправкой`, "warning");
            return false;
        }

        setErrors({});
        try {
            await contactSchema.validate(data, { abortEarly: false });
            setIsLoading(true);

            await sendContactRequest(data);
            toast.showToast("Сообщение успешно отправлено!", "success");

            localStorage.setItem(LAST_SUBMIT_KEY, Date.now().toString());
            setCanSubmit(false);
            setTimer(COOLDOWN_MS / 1000);

            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setCanSubmit(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return true;
        } catch (err: any) {
            if (err.inner) {
                const validationErrors = err.inner.reduce((acc: any, curr: any) => {
                    if (curr.path) acc[curr.path] = curr.message;
                    return acc;
                }, {});
                setErrors(validationErrors);
            } else {
                toast.showToast(err.message || "Ошибка отправки", "error");
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const formatTimer = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return { isLoading, errors, canSubmit, timer, handleSubmit, formatTimer };
};