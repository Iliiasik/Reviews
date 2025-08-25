import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getSpecialistById } from "@features/specialist/api/getSpecialistById.ts";
import type { SpecialistProfile } from "@features/specialist/types/SpecialistProfile.ts";
import { SpecialistView } from "@features/specialist/ui/SpecialistView.tsx";
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

    useEffect(() => {
        const toast = location.state?.toast;
        if (toast) {
            showToast(toast.message, toast.type || "info");

            setTimeout(() => {
                navigate(location.pathname, { replace: true });
            }, 100);
        }
    }, []);

    useEffect(() => {
        if (!id) return;
        getSpecialistById(id)
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }
    if (error) {
        return (
            <div role="alert" className="alert alert-error alert-soft max-w-md mx-auto mt-6">
                <span>Ошибка: {error}</span>
            </div>
        );
    }
    if (!data) return null;

    return (
        <main className="flex-grow p-6 flex flex-col items-center">
            <SpecialistView data={data} />
            <Reviews type="specialist" />
        </main>
    );
};
