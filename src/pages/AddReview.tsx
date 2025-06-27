import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { ReviewForm } from "@features/review/ui/ReviewForm.tsx";

export const AddReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        axios
            .get(`/api/specialist/${id}`)
            .then(res => setName(res.data.name))
            .catch(() => setError("Не удалось загрузить данные специалиста"))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <>
            <div className="max-w-2xl mx-auto p-6">
                {loading ? (
                    <p className="mb-4 text-gray-500">Загрузка специалиста...</p>
                ) : error ? (
                    <p className="mb-4 text-red-500">{error}</p>
                ) : (
                    <h1 className="text-2xl font-bold mb-4">
                        Оставить отзыв для: <span className="text-primary">{name}</span>
                    </h1>
                )}

                {!loading && !error && (
                    <ReviewForm onSubmitSuccess={() => navigate(-1)} />
                )}
            </div>
        </>
    );
};
