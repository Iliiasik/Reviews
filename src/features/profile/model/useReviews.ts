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
    });
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const { profile } = useProfile();

    const loadUserReviews = async () => {
        try {
            setLoading(true);
            const response = await ReviewsApi.getUserReviews();
            setUserReviews(response.data);
            setSummary(prev => ({
                ...prev,
                user_reviews_count: response.user_reviews_count || 0
            }));
        } catch (error) {
            console.error('Ошибка загрузки отзывов:', error);
            showToast('Ошибка загрузки ваших отзывов', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadSummary = async (userId: number) => {
        try {
            setLoading(true);
            const data = await ReviewsApi.getSummary(userId);
            setSummary(data || {
                total_reviews: 0,
                user_reviews_count: 0,
                rating: 0
            });
        } catch (error) {
            console.error('Ошибка загрузки сводки:', error);
            showToast('Ошибка загрузки сводки отзывов', 'error');
            setSummary({
                total_reviews: 0,
                user_reviews_count: 0,
                rating: 0
            });
        } finally {
            setLoading(false);
        }
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
        refreshUserReviews: loadUserReviews,
    };
};
