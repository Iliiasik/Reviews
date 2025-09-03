import { RatingInput } from '@features/review/ui/RatingInput.tsx';
import { AspectCheckboxList } from '@features/review/ui/AspectCheckBoxList.tsx';
import { AnonymousCheckbox } from '@features/review/ui/AnonymousCheckBox.tsx';
import { CommentInput } from '@features/review/ui/CommentInput.tsx';
import { useUnverifiedProfileForm } from '../model/useUnverifiedProfileForm';

export const UnverifiedProfileCreation = () => {
    const {
        user,
        name, setName,
        about, setAbout,
        text, setText,
        rating, setRating,
        type, setType,
        isAnonymous, setIsAnonymous,
        pros, cons,
        aspects,
        loading,
        leaveReview, setLeaveReview,
        handleSubmit,
        handleToggleAspect,
    } = useUnverifiedProfileForm();

    return (
        <div className="max-w-xl mx-auto mt-10 p-4 bg-base-100 rounded-xl shadow transition-all duration-300">
            <h1 className="text-2xl font-bold mb-4">
                Добавить нового {type === 'specialist' ? 'специалиста' : 'организацию'}
            </h1>

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

                {/* ЧЕКБОКС: Оставлять ли отзыв */}
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        className="checkbox"
                        checked={leaveReview}
                        onChange={() => setLeaveReview(!leaveReview)}
                    />
                    <span>Оставить отзыв</span>
                </label>

                {/* Плавная анимация формы отзыва */}
                <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        leaveReview ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="space-y-4 mt-2">
                        <RatingInput value={rating} onChange={setRating} />

                        {user && (
                            <AnonymousCheckbox value={isAnonymous} onChange={setIsAnonymous} />
                        )}

                        <AspectCheckboxList
                            label="Что понравилось?"
                            aspects={aspects.filter((a) => a.positive)}
                            selectedIds={pros}
                            onToggle={(id) => handleToggleAspect(id, 'pros')}
                        />

                        <AspectCheckboxList
                            label="Что можно улучшить?"
                            aspects={aspects.filter((a) => !a.positive)}
                            selectedIds={cons}
                            onToggle={(id) => handleToggleAspect(id, 'cons')}
                        />

                        <CommentInput value={text} onChange={setText} required={leaveReview} />
                    </div>
                </div>

                <button className="btn btn-primary w-full" disabled={loading}>
                    {loading ? 'Сохраняем...' : 'Создать профиль' + (leaveReview ? ' и отзыв' : '')}
                </button>
            </form>
        </div>
    );
};
