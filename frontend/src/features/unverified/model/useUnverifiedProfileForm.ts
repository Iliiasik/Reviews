import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { getReviewAspects } from '@features/review/api/getReviewAspects';
import { createUnverifiedProfile } from '../api/createUnverifiedProfile';
import { createReview } from '../api/createReview';
import { useUser } from '@shared/context/UserContext';
import { useToast } from '@shared/context/ToastContext';
import { toggleAspect } from '../lib/toggleAspects';
import type { ReviewAspect } from '@features/review/types/ReviewAspect';
import type { UnverifiedType } from '../types';

const profileSchema = yup.object().shape({
    name: yup
        .string()
        .max(20, 'Максимум 20 символов')
        .required('Поле обязательно'),
    about: yup
        .string()
        .max(250, 'Максимум 250 символов')
        .required('Поле обязательно'),
    text: yup
        .string()
        .max(500, 'Максимум 500 символов')
        .notRequired(),
});


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
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getReviewAspects().then(setAspects).catch(() => setAspects([]));
    }, []);

    const handleToggleAspect = (id: number, target: 'pros' | 'cons') => {
        const list = target === 'pros' ? pros : cons;
        const setList = target === 'pros' ? setPros : setCons;
        toggleAspect(id, list, setList);
    };

    const validateForm = async () => {
        try {
            await profileSchema.validate({ name, about, text }, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const newErrors = err.inner.reduce((acc, curr) => {
                    if (curr.path) acc[curr.path] = curr.message;
                    return acc;
                }, {} as Record<string, string>);
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const isValid = await validateForm();
            if (!isValid) throw new Error('Пожалуйста, исправьте ошибки в форме');

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
            const message = err instanceof Error ? err.message : 'Ошибка при создании профиля или отзыва';
            showToast(message, 'error');
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
        errors,
        handleSubmit,
        handleToggleAspect,
    };
};
