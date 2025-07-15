import { useUser } from '@shared/context/UserContext.tsx'; // путь укажи свой
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    StarIcon,
    PlusIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    MessageSquareIcon,
    ThumbsUpIcon
} from 'lucide-react';
import {likeReview} from "@features/review/api/likeReview.ts";
import {unlikeReview} from "@features/review/api/unlikeReview.ts";

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
    usefulCount?: number;
    userHasLiked?: boolean;
}


export const Reviews = ({ type }: ReviewsProps) => {
    const { id: profileId } = useParams();
    const { user, loading: userLoading } = useUser(); // получаем текущего пользователя

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    const [disabledLikes, setDisabledLikes] = useState<{[key: number]: boolean}>({});

    const handleUsefulClick = async (reviewId: number, hasLiked: boolean) => {
        if (disabledLikes[reviewId]) return; // игнорируем если disabled

        setDisabledLikes(prev => ({ ...prev, [reviewId]: true }));

        try {
            if (hasLiked) {
                await unlikeReview(reviewId);
                setReviews(prev =>
                    prev.map(review =>
                        review.id === reviewId
                            ? {
                                ...review,
                                usefulCount: Math.max((review.usefulCount ?? 1) - 1, 0),
                                userHasLiked: false,
                            }
                            : review
                    )
                );
            } else {
                await likeReview(reviewId);
                setReviews(prev =>
                    prev.map(review =>
                        review.id === reviewId
                            ? {
                                ...review,
                                usefulCount: (review.usefulCount ?? 0) + 1,
                                userHasLiked: true,
                            }
                            : review
                    )
                );
            }
        } catch (error: any) {
            console.error("Ошибка при переключении лайка:", error.response?.data || error.message);
        } finally {
            setTimeout(() => {
                setDisabledLikes(prev => ({ ...prev, [reviewId]: false }));
            }, 5000);
        }
    };


    useEffect(() => {
        axios
            .get(`/api/reviews`, { params: { profile_user_id: profileId } })
            .then((response) => {
                const normalizedReviews = response.data.map((reviewData: any) => ({
                    ...reviewData,
                    usefulCount: reviewData.useful_count,
                    userHasLiked: reviewData.user_has_liked,
                }));
                setReviews(normalizedReviews);
            })
            .catch((error) => {
                const errorMessage =
                    error.response?.data?.error || error.message;
                setError(errorMessage);
            })
            .finally(() => setLoading(false));
    }, [profileId]);



    const isOwnProfile = user?.id?.toString() === profileId;
    return (
        <section className="w-full mt-12 px-4">
            <div className="max-w-full mx-auto bg-base-100 rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4 border-b border-base-300 pb-2 text-base-content">
                    Отзывы
                </h2>

                {!userLoading && !isOwnProfile && (
                    <div className="mb-4">
                        <a
                            href={`/${type}/${profileId}/add-review`}
                            className="btn btn-primary btn-sm flex items-center gap-2"
                        >
                            <PlusIcon size={16} />
                            Оставить отзыв
                        </a>
                    </div>
                )}

                {loading &&  (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-base-200 p-4 rounded-lg h-24"
                            ></div>
                        ))}
                    </div>
                )}

                {error && (
                    <p className="text-center text-error">Ошибка: {error}</p>
                )}

                {!loading && !error && reviews.length === 0 && (
                    <p className="text-center text-base-content/60 flex flex-col items-center gap-2">
                        <MessageSquareIcon size={32} className="text-base-content/40" />
                        Пока нет отзывов.
                    </p>
                )}

                {!loading && !error && reviews.length > 0 && (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="p-4 bg-base-200 border border-base-300 rounded-lg shadow-sm transition hover:shadow-md hover:border-primary/40"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        {review.author ? (
                                            <>
                                                <img
                                                    src={
                                                        review.author.avatar_url ||
                                                        'https://api.dicebear.com/7.x/initials/svg?seed=user'
                                                    }
                                                    alt={review.author.name}
                                                    className="w-10 h-10 rounded-full object-cover border border-base-300"
                                                />
                                                <span className="font-medium text-base-content">{review.author.name}</span>
                                            </>
                                        ) : (<span className="text-base-content/60 italic">Аноним</span>
                                        )}
                                    </div>
                                    <span className="text-warning font-semibold flex items-center gap-1">
                                        {review.rating}
                                        <StarIcon size={18} className="text-warning" />
                                    </span>
                                </div>

                                <p className="text-base-content whitespace-pre-line">{review.text}</p>

                                {(review.pros.length > 0 || review.cons.length > 0) && (
                                    <div className="mt-3 text-sm text-base-content/80 space-y-1">
                                        {review.pros.length > 0 && (
                                            <p className="flex items-start gap-1 text-green-500">
                                                <CheckCircleIcon size={14} className="mt-0.5" />
                                                <span>
                                                <strong>Плюсы:</strong> {review.pros.map(p => p.description).join(', ')}
                                                </span>
                                            </p>
                                        )}
                                        {review.cons.length > 0 && (
                                            <p className="flex items-start gap-1 text-red-500">
                                                <XCircleIcon size={14} className="mt-0.5" />
                                                <span>
                                                <strong>Минусы:</strong> {review.cons.map(c => c.description).join(', ')}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                )}
                                <div className="divider my-0 mx-3"></div>
                                <div className="mt-3 flex justify-between items-center">
                                    <p className="text-sm text-base-content/50 flex items-center gap-1">
                                        <CalendarIcon size={14} />
                                        {new Date(review.created_at).toLocaleDateString('ru-RU', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>

                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip={user ? 'Был ли отзыв полезен?' : 'Войдите, чтобы оценить отзыв'}
                                    >
                                        <button
                                            disabled={disabledLikes[review.id] || !user} // ← добавлена проверка !user
                                            className={`flex items-center gap-1 text-sm font-medium transition ${
                                                review.userHasLiked
                                                    ? 'text-blue-600'
                                                    : 'text-base-content/70 hover:text-base-content'
                                            }`}
                                            onClick={() => handleUsefulClick(review.id, review.userHasLiked ?? false)}
                                            aria-label="Переключить отметку полезности"
                                        >
                                            <ThumbsUpIcon size={16} />
                                            {review.usefulCount ?? 0}
                                        </button>
                                    </div>

                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
