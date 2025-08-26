import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiStar, FiCornerRightDown, FiFilter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { ReviewCard } from './reviews/ReviewCard';
import { AspectSection } from '@features/profile/ui/reviews/AspectSection.tsx';

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
        pros_count: Array<{
            id: number;
            description: string;
            count: number;
        }>;
        cons_count: Array<{
            id: number;
            description: string;
            count: number;
        }>;
    };
    loading: boolean;
    reviewsLoading: boolean;
    pagination: {
        page: number;
        limit: number;
        totalPages: number;
        totalItems: number;
    };
    filters: {
        role: string;
    };
    handlePageChange: (page: number) => void;
    handleFilterChange: (role: string) => void;
}

export const ReviewsTab = forwardRef<HTMLDivElement, ReviewsTabProps>(
    (
        {
            profile,
            userReviews,
            summary,
            loading,
            reviewsLoading,
            pagination,
            filters,
            handlePageChange,
            handleFilterChange,
        },
        ref
    ) => {
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
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-medium text-lg">Ваш рейтинг</h3>
                                                <Link
                                                    to={`/${profile.role}/${profile.id}`}
                                                    className="btn btn-sm btn-outline flex items-center gap-1"
                                                >
                                                    <span>Мой профиль</span>
                                                    <FiExternalLink size={16} />
                                                </Link>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl sm:text-3xl font-bold">
                                                        {summary.rating.toFixed(1)}
                                                    </span>
                                                    {renderRatingStars(summary.rating || 0)}
                                                </div>
                                                <span className="text-sm text-base-content/60">
                                                    {summary.total_reviews}{' '}
                                                    {summary.total_reviews === 1
                                                        ? 'отзыв'
                                                        : summary.total_reviews > 1 && summary.total_reviews < 5
                                                            ? 'отзыва'
                                                            : 'отзывов'}
                                                </span>
                                            </div>

                                            <AspectSection
                                                title="Сильные стороны"
                                                aspects={summary.pros_count}
                                                icon={<FiCornerRightDown size={16} className="text-success" />}
                                                color="success"
                                            />

                                            <AspectSection
                                                title="Слабые стороны"
                                                aspects={summary.cons_count}
                                                icon={<FiCornerRightDown size={16} className="text-error" />}
                                                color="error"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h3 className="text-lg font-medium">Оставленные вами отзывы</h3>

                                <div className="hidden sm:flex items-center gap-3">
                                    <div className="form-control">
                                        <label className="label cursor-pointer gap-2">
                                            <span className="label-text">Специалисты</span>
                                            <input
                                                type="radio"
                                                name="role"
                                                className="radio radio-sm"
                                                checked={filters.role === 'specialist'}
                                                onChange={() => handleFilterChange('specialist')}
                                            />
                                        </label>
                                    </div>
                                    <div className="form-control">
                                        <label className="label cursor-pointer gap-2">
                                            <span className="label-text">Организации</span>
                                            <input
                                                type="radio"
                                                name="role"
                                                className="radio radio-sm"
                                                checked={filters.role === 'organization'}
                                                onChange={() => handleFilterChange('organization')}
                                            />
                                        </label>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-ghost"
                                        onClick={() => handleFilterChange('')}
                                    >
                                        Сбросить
                                    </button>
                                </div>

                                <div className="sm:hidden dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-sm btn-ghost">
                                        <FiFilter className="mr-1" />
                                        Фильтры
                                    </div>
                                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-1">
                                        <li>
                                            <label className="label cursor-pointer justify-start gap-2">
                                                <input
                                                    type="radio"
                                                    name="role-mobile"
                                                    className="radio radio-sm"
                                                    checked={filters.role === 'specialist'}
                                                    onChange={() => handleFilterChange('specialist')}
                                                />
                                                <span className="label-text">Специалисты</span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="label cursor-pointer justify-start gap-2">
                                                <input
                                                    type="radio"
                                                    name="role-mobile"
                                                    className="radio radio-sm"
                                                    checked={filters.role === 'organization'}
                                                    onChange={() => handleFilterChange('organization')}
                                                />
                                                <span className="label-text">Организации</span>
                                            </label>
                                        </li>
                                        <li>
                                            <button
                                                className="btn btn-sm btn-ghost justify-start"
                                                onClick={() => handleFilterChange('')}
                                            >
                                                Сбросить фильтры
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {reviewsLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex justify-center py-8"
                                    >
                                        <span className="loading loading-spinner loading-lg text-primary"></span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-4"
                                    >
                                        <span className="text-sm text-base-content/60 block">
                                            {pagination.totalItems}{' '}
                                            {pagination.totalItems === 1
                                                ? 'отзыв'
                                                : pagination.totalItems > 1 && pagination.totalItems < 5
                                                    ? 'отзыва'
                                                    : 'отзывов'}
                                        </span>

                                        {userReviews.length > 0 ? (
                                            <>
                                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                    {userReviews.map((review) => (
                                                        <ReviewCard key={review.id} review={review} />
                                                    ))}
                                                </div>

                                                <div className="flex justify-center mt-6">
                                                    <div className="join">
                                                        <button
                                                            className="join-item btn btn-sm"
                                                            disabled={pagination.page === 1}
                                                            onClick={() => handlePageChange(pagination.page - 1)}
                                                        >
                                                            «
                                                        </button>
                                                        {Array.from(
                                                            { length: Math.min(5, pagination.totalPages) },
                                                            (_, i) => {
                                                                let pageNum;
                                                                if (pagination.totalPages <= 5) {
                                                                    pageNum = i + 1;
                                                                } else if (pagination.page <= 3) {
                                                                    pageNum = i + 1;
                                                                } else if (
                                                                    pagination.page >=
                                                                    pagination.totalPages - 2
                                                                ) {
                                                                    pageNum = pagination.totalPages - 4 + i;
                                                                } else {
                                                                    pageNum = pagination.page - 2 + i;
                                                                }

                                                                return (
                                                                    <button
                                                                        key={pageNum}
                                                                        className={`join-item btn btn-sm ${
                                                                            pagination.page === pageNum
                                                                                ? 'btn-active'
                                                                                : ''
                                                                        }`}
                                                                        onClick={() => handlePageChange(pageNum)}
                                                                    >
                                                                        {pageNum}
                                                                    </button>
                                                                );
                                                            }
                                                        )}
                                                        <button
                                                            className="join-item btn btn-sm"
                                                            disabled={pagination.page === pagination.totalPages}
                                                            onClick={() => handlePageChange(pagination.page + 1)}
                                                        >
                                                            »
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="bg-base-200 text-base-content/60 p-6 rounded-box text-center">
                                                {filters.role
                                                    ? `Вы ещё не оставляли отзывов для ${
                                                        filters.role === 'specialist'
                                                            ? 'специалистов'
                                                            : 'организаций'
                                                    }`
                                                    : 'Вы ещё не оставляли отзывов'}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

ReviewsTab.displayName = 'ReviewsTab';