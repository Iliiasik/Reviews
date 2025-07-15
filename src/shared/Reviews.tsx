import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from "axios";
import {StarIcon} from "lucide-react";


interface ReviewAspect {
    id: number;
    description: string;
}
interface ReviewsProps {
    type: 'specialist' | 'organization';
}
interface Author {
    id: number;
    name: string;
    avatar_url: string;
}

interface Review {
    id: number;
    author: Author | null;
    rating: number;
    text: string;
    created_at: string;
    pros: ReviewAspect[];
    cons: ReviewAspect[];
}


export const Reviews = ({type}:ReviewsProps) => {
    const { id } = useParams();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get(`/api/reviews`, { params: { profile_user_id: id } })
            .then((res) => setReviews(res.data))
            .catch((err) => setError(err.response?.data?.error || err.message))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <section className="w-full mt-12 px-4">
            <div className="max-w-full mx-auto bg-base-100 rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4 border-b border-base-300 pb-2 text-base-content">
                    Отзывы
                </h2>
                <div className="mb-4">
                    <a href={`/${type}/${id}/add-review`} className="btn btn-primary">
                        Оставить отзыв
                    </a>
                </div>

                {loading && (
                    <p className="text-center text-base-content/60">Загрузка отзывов...</p>
                )}

                {error && (
                    <p className="text-center text-error">Ошибка: {error}</p>
                )}

                {!loading && !error && reviews.length === 0 && (
                    <p className="text-center text-base-content/60">Пока нет отзывов.</p>
                )}

                {!loading && !error && reviews.length > 0 && (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="p-4 bg-base-200 border border-base-300 rounded-lg shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        {review.author ? (
                                            <>
                                                <img
                                                    src={review.author.avatar_url || "https://api.dicebear.com/7.x/initials/svg?seed=user"}
                                                    alt={review.author.name}
                                                    className="w-8 h-8 rounded-full object-cover border border-base-300"
                                                />
                                                <span className="font-medium text-base-content">
                                                    {review.author.name}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-base-content/60 italic">Аноним</span>
                                        )}
                                    </div>
                                    <span className="text-warning font-semibold flex items-center gap-1">
                                        {review.rating}
                                        <StarIcon size={18} className="text-warning" />
                                    </span>
                                </div>

                                <p className="text-base-content whitespace-pre-line">{review.text}</p>

                                {(review.pros.length > 0 || review.cons.length > 0) && (
                                    <div className="mt-2 text-sm text-base-content/80 space-y-1">
                                        {review.pros.length > 0 && (
                                            <p><strong>Плюсы:</strong> {review.pros.map(p => p.description).join(", ")}</p>
                                        )}
                                        {review.cons.length > 0 && (
                                            <p><strong>Минусы:</strong> {review.cons.map(c => c.description).join(", ")}</p>
                                        )}
                                    </div>
                                )}

                                <p className="text-sm text-base-content/50 mt-2">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

