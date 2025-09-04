import { RatingInput } from "@shared/ui/review/RatingInput.tsx"
import { AspectCheckboxList } from "@shared/ui/review/AspectCheckBoxList.tsx"
import { AnonymousCheckbox } from "@shared/ui/review/AnonymousCheckBox.tsx"
import { CommentInput } from "@shared/ui/review/CommentInput.tsx"
import { useUnverifiedProfileForm } from "../model/useUnverifiedProfileForm"
import { ProfileHeaderInput } from "./ProfileHeaderInput"

export const UnverifiedProfileForm = () => {
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
        errors,
        handleSubmit,
        handleToggleAspect,
    } = useUnverifiedProfileForm()

    return (
        <div className="w-full max-w-full min-w-0 px-4 md:px-6">
            <form onSubmit={handleSubmit} className="space-y-6 min-w-0 mb-6">
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4 w-full min-w-0">
                    <legend className="badge badge-soft badge-primary font-semibold px-4 py-2 text-xl">
                        Добавление
                    </legend>

                    <div className="space-y-2">
                        <ProfileHeaderInput
                            type={type}
                            setType={setType}
                            name={name}
                            setName={setName}
                            about={about}
                            setAbout={setAbout}
                            nameError={errors.name}
                            aboutError={errors.about}
                        />
                    </div>
                </fieldset>

                <div className="divider">Оставить отзыв</div>

                <div className="form-control">
                    <label className="cursor-pointer label justify-start gap-3 p-0">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-sm"
                            checked={leaveReview}
                            onChange={() => setLeaveReview(!leaveReview)}
                        />
                        <span className="label-text text-sm sm:text-base">
                            Добавить отзыв вместе с профилем
                        </span>
                    </label>
                </div>

                <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        leaveReview ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4 mt-4 w-full min-w-0">
                        <legend className="badge badge-soft badge-primary font-semibold px-4 py-2 text-xl">
                            Отзыв
                        </legend>

                        <div className="space-y-5 min-w-0">
                            <div className="flex flex-col items-center space-y-4 pt-2">
                                <RatingInput value={rating} onChange={setRating} />
                            </div>

                            <AspectCheckboxList
                                label="Что понравилось?"
                                aspects={aspects.filter((a) => a.positive)}
                                selectedIds={pros}
                                onToggle={(id) => handleToggleAspect(id, "pros")}
                            />

                            <AspectCheckboxList
                                label="Что можно улучшить?"
                                aspects={aspects.filter((a) => !a.positive)}
                                selectedIds={cons}
                                onToggle={(id) => handleToggleAspect(id, "cons")}
                            />

                            {user && (
                                <AnonymousCheckbox
                                    value={isAnonymous}
                                    onChange={setIsAnonymous}
                                />
                            )}

                            <CommentInput
                                value={text}
                                onChange={setText}
                                className={errors.text ? "input input-bordered w-full border-error" : "input input-bordered w-full"}
                            />
                            {errors.text && (
                                <span className="text-error text-sm mt-1">{errors.text}</span>
                            )}
                        </div>
                    </fieldset>
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                    {loading
                        ? <span className="loading loading-spinner loading-sm"></span>
                        : "Создать профиль" + (leaveReview ? " и отзыв" : "")
                    }
                </button>
            </form>
        </div>
    )
}
