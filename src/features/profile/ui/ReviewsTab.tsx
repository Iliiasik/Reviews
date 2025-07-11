import {forwardRef, type JSX} from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiStar, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';

interface ReviewsTabProps {
    profile: {
        id: number;
        role: string;
        name?: string;
        avatar_url?: string;
    };
    userReviews: any[];
    summary: {
        total_reviews: number;
        user_reviews_count: number;
        rating: number;
    };
    loading: boolean;
}

const aspectIcons: Record<number, JSX.Element> = {
    1: <span className="text-lg">😊</span>, // Вежливость
    2: <span className="text-lg">⏰</span>, // Пунктуальность
    3: <span className="text-lg">🎓</span>, // Компетентность
    4: <span className="text-lg">🧼</span>, // Чистота помещения
    5: <span className="text-lg">🗣️</span>, // Умение слушать
    6: <span className="text-lg">😠</span>, // Грубость
    7: <span className="text-lg">⌛</span>, // Слишком долго ждать
    8: <span className="text-lg">🤷</span>, // Некомпетентность
    9: <span className="text-lg">🧹</span>, // Неопрятность
    10: <span className="text-lg">🙉</span>, // Игнорирование жалоб
};

const ReviewAspectCard = ({ aspect }: { aspect: any }) => {
    return (
        <div className="flex-shrink-0 w-28 p-2 rounded-xl shadow-sm flex flex-col items-center text-sm text-base-content/80 bg-base-200">
            {aspectIcons[aspect.id] || <span className="text-lg">⭐</span>}
            <span className="text-xs mt-1 text-center line-clamp-2">{aspect.description}</span>
        </div>
    );
};

export const ReviewCard = ({ review }: { review: any }) => {
    const formattedRating = Number.isInteger(review.rating)
        ? review.rating.toString()
        : review.rating.toFixed(1)

    return (
        <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="card-body p-3 sm:p-4 md:p-6">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                            <div className="avatar flex-shrink-0">
                                <div className="w-9 sm:w-10 rounded-full">
                                    <img
                                        src={
                                            review.profile_user.avatar_url ||
                                            `https://api.dicebear.com/7.x/initials/svg?seed=${review.profile_user.name}`
                                        }
                                        alt="Аватар профиля"
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-baseline gap-1 flex-wrap">
                                    <h4 className="font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-[180px]">
                                        {review.profile_user.name}
                                    </h4>
                                    <Link
                                        to={`/${review.profile_user.role.name}/${review.profile_user.id}`}
                                        className="text-xs flex items-center gap-1 text-primary hover:text-primary-focus transition-colors whitespace-nowrap"
                                    >
                                        <span>Перейти</span>
                                        <FiExternalLink size={12} />
                                    </Link>
                                </div>
                                <div className="badge badge-ghost text-xs mt-0.5 px-1.5 py-0.5 border-base-300">
                                    {review.profile_user.role.name === 'specialist' && 'Специалист'}
                                    {review.profile_user.role.name === 'organization' && 'Организация'}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:ml-auto">
                            <span className="text-base sm:text-lg font-bold text-yellow-600 dark:text-yellow-400">
                                {formattedRating}
                            </span>
                            <FiStar size={16} className="fill-current text-yellow-500 flex-shrink-0" />
                        </div>
                    </div>
                    <p className="text-sm text-base-content mt-1 break-words whitespace-pre-line">
                        {review.text}
                    </p>
                    {(review.pros.length > 0 || review.cons.length > 0) && (
                        <div className="mt-2 space-y-3">
                            {review.pros.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-success mb-1">
                                        <FiThumbsUp size={12} className="flex-shrink-0" />
                                        <span>Плюсы</span>
                                    </div>
                                    <div className="overflow-x-hidden pb-2">
                                        <div className="flex gap-2 w-max min-w-full px-1">
                                            {review.pros.map((pro: any) => (
                                                <ReviewAspectCard key={pro.id} aspect={pro} type="pro" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {review.cons.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-error mb-1">
                                        <FiThumbsDown size={12} className="flex-shrink-0" />
                                        <span>Минусы</span>
                                    </div>
                                    <div className="overflow-x-hidden pb-2">
                                        <div className="flex gap-2 w-max min-w-full px-1">
                                            {review.cons.map((con: any) => (
                                                <ReviewAspectCard key={con.id} aspect={con} type="con" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export const ReviewsTab = forwardRef<HTMLDivElement, ReviewsTabProps>(
    ({ profile, userReviews, summary, loading }, ref) => {
        const renderRatingStars = (rating: number) => {
            const stars = [];
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;

            for (let i = 1; i <= 5; i++) {
                if (i <= fullStars) {
                    stars.push(<FiStar key={i} className="fill-current text-yellow-500" />);
                } else if (i === fullStars + 1 && hasHalfStar) {
                    stars.push(<FiStar key={i} className="fill-current text-yellow-500" />);
                } else {
                    stars.push(<FiStar key={i} className="text-yellow-500" />);
                }
            }

            return <div className="flex gap-0.5">{stars}</div>;
        };

        if (loading) {
            return (
                <div ref={ref} className="flex justify-center p-8">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            );
        }

        return (
            <div ref={ref} className="divide-y divide-base-300">
                <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-xl font-semibold mb-6">Отзывы</h2>

                    <div className="space-y-6">
                        {(profile.role === 'specialist' || profile.role === 'organization') && (
                            <div className="card bg-base-100 border border-base-300 shadow-sm">
                                <div className="card-body p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <h3 className="font-medium text-lg">Ваш рейтинг</h3>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl sm:text-3xl font-bold">
                                                        {summary.rating % 1 === 0
                                                            ? summary.rating.toString()
                                                            : summary.rating?.toFixed(1)}
                                                    </span>
                                                    {renderRatingStars(summary.rating || 0)}
                                                </div>
                                                <span className="text-sm text-base-content/60">
                                                    {summary.total_reviews} {summary.total_reviews === 1 ? 'отзыв' :
                                                    summary.total_reviews > 1 && summary.total_reviews < 5 ? 'отзыва' : 'отзывов'}
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/${profile.role}/${profile.id}`}
                                            className="btn btn-ghost btn-sm mt-2 sm:mt-0 flex items-center gap-1 text-primary hover:text-primary-focus"
                                        >
                                            <span>Мой профиль</span>
                                            <FiExternalLink size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Оставленные вами отзывы</h3>

                            <span className="text-sm text-base-content/60 block">
                                {summary.user_reviews_count} {summary.user_reviews_count === 1
                                ? 'отзыв'
                                : summary.user_reviews_count > 1 && summary.user_reviews_count < 5
                                    ? 'отзыва'
                                    : 'отзывов'}
                            </span>

                            {userReviews.length > 0 ? (
                                <div className="grid gap-4">
                                    {userReviews.map(review => (
                                        <ReviewCard key={review.id} review={review} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-base-200 text-base-content/60 p-6 rounded-box text-center">
                                    Вы ещё не оставляли отзывов
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

ReviewsTab.displayName = 'ReviewsTab';