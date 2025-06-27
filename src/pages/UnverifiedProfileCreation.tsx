import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RatingInput } from '@features/review/ui/RatingInput.tsx';
import { AspectCheckboxList } from '@features/review/ui/AspectCheckBoxList.tsx';
import { AnonymousCheckbox } from '@features/review/ui/AnonymousChechBox.tsx';
import { CommentTextarea } from '@features/review/ui/CommentTextArea.tsx';
import { getReviewAspects } from '@features/review/api/getReviewAspects.ts';
import type { ReviewAspect } from '@features/review/types/ReviewAspect.ts';
import axios from 'axios';
import { useUser } from '@shared/context/UserContext.tsx';

export const UnverifiedProfileCreation = () => {
    const { user } = useUser();

    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);
    const [type, setType] = useState<'specialist' | 'organization'>('specialist');
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [pros, setPros] = useState<number[]>([]);
    const [cons, setCons] = useState<number[]>([]);
    const [aspects, setAspects] = useState<ReviewAspect[]>([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getReviewAspects().then(setAspects).catch(() => setAspects([]));
    }, []);

    const toggleAspect = (id: number, target: 'pros' | 'cons') => {
        const list = target === 'pros' ? pros : cons;
        const setList = target === 'pros' ? setPros : setCons;
        setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const config = { withCredentials: true };

        try {
            const profileRes = await axios.post('/api/unverified-profile', {
                name,
                about,
                type,
            }, config);

            const userId = profileRes.data.user_id;

            await axios.post('/api/reviews', {
                profile_user_id: userId,
                rating,
                text,
                is_anonymous: user ? isAnonymous : true,
                pros,
                cons,
            }, config);

            navigate(`/${type}/${userId}`);
        } catch (err) {
            console.error('Ошибка при создании профиля и отзыва', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-4 bg-base-100 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Добавить нового {type === 'specialist' ? 'специалиста' : 'организацию'}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    className="select select-bordered w-full"
                    value={type}
                    onChange={(e) => setType(e.target.value as 'specialist' | 'organization')}
                >
                    <option value="specialist">Специалист</option>
                    <option value="organization">Организация</option>
                </select>

                <input
                    className="input input-bordered w-full"
                    placeholder="Имя и фамилия"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder={`Расскажите о ${type === 'specialist' ? 'специалисте' : 'организации'}`}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    required
                />

                <RatingInput value={rating} onChange={setRating} />

                {user && (
                    <AnonymousCheckbox value={isAnonymous} onChange={setIsAnonymous} />
                )}

                <AspectCheckboxList
                    label="Что понравилось?"
                    aspects={aspects.filter((a) => a.positive)}
                    selectedIds={pros}
                    onToggle={(id) => toggleAspect(id, 'pros')}
                />

                <AspectCheckboxList
                    label="Что можно улучшить?"
                    aspects={aspects.filter((a) => !a.positive)}
                    selectedIds={cons}
                    onToggle={(id) => toggleAspect(id, 'cons')}
                />

                <CommentTextarea value={text} onChange={setText} />

                <button className="btn btn-primary w-full" disabled={loading}>
                    {loading ? 'Сохраняем...' : 'Создать профиль и отзыв'}
                </button>
            </form>
        </div>
    );
};
