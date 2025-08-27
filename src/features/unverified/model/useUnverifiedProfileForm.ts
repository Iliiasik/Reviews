import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReviewAspects } from '@features/review/api/getReviewAspects';
import { createUnverifiedProfile } from '../api/createUnverifiedProfile';
import { createReview } from '../api/createReview';
import { useUser } from '@shared/context/UserContext';
import { useToast } from '@shared/context/ToastContext';
import { toggleAspect } from '../lib/toggleAspects';
import type { ReviewAspect } from '@features/review/types/ReviewAspect';
import type { UnverifiedType } from '../types';

export const useUnverifiedProfileForm = () => {
    const { user } = useUser();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);
    const [type, setType] = useState<UnverifiedType>('specialist');
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [pros, setPros] = useState<number[]>([]);
    const [cons, setCons] = useState<number[]>([]);
    const [aspects, setAspects] = useState<ReviewAspect[]>([]);
    const [loading, setLoading] = useState(false);
    const [leaveReview, setLeaveReview] = useState(true);

    useEffect(() => {
        getReviewAspects().then(setAspects).catch(() => setAspects([]));
    }, []);

    const handleToggleAspect = (id: number, target: 'pros' | 'cons') => {
        const list = target === 'pros' ? pros : cons;
        const setList = target === 'pros' ? setPros : setCons;
        toggleAspect(id, list, setList);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const profileRes = await createUnverifiedProfile({ name, about, type });
            const userId = profileRes.data.user_id;
            showToast('Профиль создан', 'success');

            if (leaveReview) {
                await createReview({
                    profile_user_id: userId,
                    rating,
                    text,
                    is_anonymous: user ? isAnonymous : true,
                    pros,
                    cons,
                });
                showToast('Профиль успешно создан и отзыв оставлен', 'success');
            }

            navigate(`/${type}/${userId}`);
        } catch (err) {
            console.error('Ошибка при создании профиля и отзыва', err);
            showToast('Ошибка при создании профиля или отзыва', 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        name,
        setName,
        about,
        setAbout,
        text,
        setText,
        rating,
        setRating,
        type,
        setType,
        isAnonymous,
        setIsAnonymous,
        pros,
        cons,
        aspects,
        loading,
        leaveReview,
        setLeaveReview,
        handleSubmit,
        handleToggleAspect,
    };
};
