import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getSpecialistById } from "@features/specialist/api/getSpecialistById.ts";
import type { SpecialistProfile } from "@features/specialist/types/SpecialistProfile.ts";
import { SpecialistProfileView } from "@features/specialist/ui/SpecialistProfileView.tsx";
import { Reviews } from "@features/review/ui/Reviews.tsx";
import { useToast } from "@shared/context/ToastContext.tsx";

export const Specialist = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [data, setData] = useState<SpecialistProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ Показ тоста один раз и сброс состояния безопасным способом
    useEffect(() => {
        const toast = location.state?.toast;
        if (toast) {
            showToast(toast.message, toast.type || "info");

            setTimeout(() => {
                navigate(location.pathname, { replace: true });
            }, 100); // достаточно короткой задержки
        }
    }, []);

    useEffect(() => {
        if (!id) return;
        getSpecialistById(id)
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-6 text-center">Загрузка...</div>;
    if (error) return <div className="p-6 text-red-500 text-center">Ошибка: {error}</div>;
    if (!data) return null;

    return (
        <main className="flex-grow p-6 flex flex-col items-center">
            <SpecialistProfileView data={data} />
            <Reviews type="specialist" />
        </main>
    );
};
