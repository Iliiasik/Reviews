import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ReviewForm } from "@features/review/ui/ReviewForm.tsx";

export const AddReview = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const type = location.pathname.includes("/organization") ? "organization" : "specialist";

    const [name, setName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id || !type) return;

        axios
            .get(`/api/${type}/${id}`)
            .then(res => setName(res.data.name))
            .catch(() =>
                setError(`Не удалось загрузить данные для ${type === 'organization' ? 'организации' : 'специалиста'}`)
            )
            .finally(() => setLoading(false));
    }, [id, type]);

    return (
        <div className="max-w-2xl mx-auto p-6">
            {loading ? (
                <p className="mb-4 text-gray-500">Загрузка данных...</p>
            ) : error ? (
                <p className="mb-4 text-red-500">{error}</p>
            ) : (
                <h1 className="text-2xl font-bold mb-4">
                    Оставить отзыв для: <span className="text-primary">{name}</span>
                </h1>
            )}

            {!loading && !error && id && (
                <ReviewForm
                    profileUserId={Number(id)}
                    onSubmitSuccess={() =>
                        navigate(`/${type}/${id}`, {
                            state: {
                                toast: {
                                    message: 'Отзыв успешно добавлен',
                                    type: 'success',
                                },
                            },
                        })
                    }
                />
            )}
        </div>
    );
};
