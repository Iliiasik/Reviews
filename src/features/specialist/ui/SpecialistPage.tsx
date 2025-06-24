import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getSpecialistById } from "@features/specialist/api/getSpecialistById";
import type {SpecialistProfile} from "@features/specialist/types/SpecialistProfile";
import { SpecialistProfileView } from "@features/specialist/ui/SpecialistProfileView";
import { SpecialistReviews } from "@features/specialist/ui/SpecialistReviews";

export const SpecialistPage = () => {
    const { id } = useParams();
    const [data, setData] = useState<SpecialistProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            <SpecialistReviews />
        </main>
    );
};
