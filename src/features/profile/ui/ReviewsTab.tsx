import { forwardRef, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiStar, FiThumbsUp, FiThumbsDown, FiChevronDown } from 'react-icons/fi';

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
    1: <span className="text-lg">😊</span>,
    2: <span className="text-lg">⏰</span>,
    3: <span className="text-lg">🎓</span>,
    4: <span className="text-lg">🧼</span>,
    5: <span className="text-lg">🗣️</span>,
    6: <span className="text-lg">😠</span>,
    7: <span className="text-lg">⌛</span>,
    8: <span className="text-lg">🤷</span>,
    9: <span className="text-lg">🧹</span>,
    10: <span className="text-lg">🙉</span>,
};

const ReviewAspectCard = ({ aspect }: { aspect: any }) => {
    return (
        <div className="flex-shrink-0 w-16 p-0.5 rounded-md shadow-sm flex flex-col items-center text-[10px] text-base-content/70 bg-base-200">
            <span className="text-base">
                {aspectIcons[aspect.id] || '⭐'}
            </span>
            <span className="text-[8px] mt-0.5 text-center leading-tight line-clamp-2">
                {aspect.description}
            </span>
        </div>
    );
};


export const ReviewCard = ({ review }: { review: any }) => {
    const formattedDate = new Date(review.created_at).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const rating = Math.round(review.rating);

    return (
        <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col min-h-[16rem] min-w-[18rem] p-2">
            <div className="card-body p-3 flex-1">
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex justify-between items-start gap-2">
                        <Link
                            to={`/${review.profile_user.role.name}/${review.profile_user.id}`}
                            className="flex items-start gap-2 min-w-0 flex-1"
                        >
                            <div className="avatar flex-shrink-0">
                                <div className="w-8 rounded-full">
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
                                <h4 className="font-semibold text-sm truncate">
                                    {review.profile_user.name}
                                </h4>
                                <div className="badge badge-ghost text-xs mt-0.5 px-1 py-0">
                                    {review.profile_user.role.name === 'specialist' && 'Специалист'}
                                    {review.profile_user.role.name === 'organization' && 'Организация'}
                                </div>
                            </div>
                        </Link>

                        <div className="flex gap-2">
                            {review.pros.length > 0 && (
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-xs btn-ghost flex items-center gap-1 px-1">
                                        <FiThumbsUp size={12} className="text-success" />
                                        <span className="text-xs">{review.pros.length}</span>
                                        <FiChevronDown size={10} />
                                    </div>
                                    <div tabIndex={0} className="dropdown-content z-[1] card card-sm bg-base-100 shadow-lg w-auto max-h-60 overflow-y-auto">
                                        <div className="card-body p-2">
                                            <div className={`grid ${review.pros.length > 1 ? 'grid-cols-3' : ''} gap-1 w-max`}>
                                                {review.pros.map((pro: any) => (
                                                    <ReviewAspectCard key={pro.id} aspect={pro} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {review.cons.length > 0 && (
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-xs btn-ghost flex items-center gap-1 px-1">
                                        <FiThumbsDown size={12} className="text-error" />
                                        <span className="text-xs">{review.cons.length}</span>
                                        <FiChevronDown size={10} />
                                    </div>
                                    <div tabIndex={0} className="dropdown-content z-[1] card card-sm bg-base-100 shadow-lg w-auto max-h-60 overflow-y-auto">
                                        <div className="card-body p-2">
                                            <div className={`grid ${review.cons.length > 1 ? 'grid-cols-3' : ''} gap-1 w-max`}>
                                                {review.cons.map((con: any) => (
                                                    <ReviewAspectCard key={con.id} aspect={con} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-sm text-base-content mt-1 break-words whitespace-pre-line line-clamp-3 flex-1">
                        {review.text}
                    </p>
                </div>
            </div>

            <div className="divider my-0 mx-3"></div>

            <div className="px-3 pb-2 pt-1 flex justify-between items-center text-xs">
                <div className="flex items-center gap-1 text-yellow-500">
                    <span className="font-medium">{rating}</span>
                    <FiStar size={12} className="fill-current" />
                </div>
                <span className="text-base-content/60">{formattedDate}</span>
            </div>
        </div>
    );
};

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
                                                    <span className="text-2xl sm:text-3xl font-bold ">
                                                        {summary.rating.toFixed(1)}
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
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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