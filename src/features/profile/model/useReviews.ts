import { useState, useEffect } from 'react';
import { useToast } from '@shared/context/ToastContext';
import { ReviewsApi } from '../api/reviews';
import { useProfile } from './useProfile';
import type { Review, ReviewsSummary } from '../types/reviews';

export const useReviews = () => {
    const [userReviews, setUserReviews] = useState<Review[]>([]);
    const [summary, setSummary] = useState<ReviewsSummary>({
        total_reviews: 0,
        user_reviews_count: 0,
        rating: 0,
        pros_count: [],
        cons_count: [],
    });
    const [loading, setLoading] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6,
        totalPages: 1,
        totalItems: 0,
    });
    const [filters, setFilters] = useState({
        role: '',
    });
    const { showToast } = useToast();
    const { profile } = useProfile();

    const loadUserReviews = async (page: number = 1, limit: number = 6, role: string = '') => {
        try {
            setReviewsLoading(true);
            const response = await ReviewsApi.getUserReviews(page, limit, role);
            setUserReviews(response.data);
            setPagination(prev => ({
                ...prev,
                page,
                limit,
                totalPages: Math.ceil(response.total / limit),
                totalItems: response.total,
            }));
        } catch (error) {
            console.error('Ошибка загрузки отзывов:', error);
            showToast('Ошибка загрузки ваших отзывов', 'error');
        } finally {
            setReviewsLoading(false);
        }
    };

    const loadSummary = async (userId: number) => {
        try {
            setLoading(true);
            const data = await ReviewsApi.getSummary(userId);
            setSummary(data || {
                total_reviews: 0,
                user_reviews_count: 0,
                rating: 0,
                pros_count: [],
                cons_count: [],
            });
        } catch (error) {
            console.error('Ошибка загрузки сводки:', error);
            showToast('Ошибка загрузки сводки отзывов', 'error');
            setSummary({
                total_reviews: 0,
                user_reviews_count: 0,
                rating: 0,
                pros_count: [],
                cons_count: [],
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        loadUserReviews(page, pagination.limit, filters.role);
    };

    const handleFilterChange = (role: string) => {
        setFilters({ role });
        loadUserReviews(1, pagination.limit, role);
    };

    useEffect(() => {
        if (!profile) return;

        loadUserReviews();

        if (profile.role === 'specialist' || profile.role === 'organization') {
            loadSummary(profile.id);
        }
    }, [profile]);

    return {
        userReviews,
        summary,
        loading,
        reviewsLoading,
        pagination,
        filters,
        refreshUserReviews: loadUserReviews,
        handlePageChange,
        handleFilterChange,
    };
};