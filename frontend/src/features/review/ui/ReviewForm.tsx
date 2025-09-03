import { useEffect, useState } from "react"
import type { ReviewAspect } from "@features/review/types/ReviewAspect"
import { getReviewAspects } from "@features/review/api/getReviewAspects"
import { toggleItemInList } from "@features/review/lib/toggleItemInList"
import { RatingInput } from "@features/review/ui/RatingInput"
import { AspectCheckboxList } from "@features/review/ui/AspectCheckBoxList"
import { CommentInput } from "@features/review/ui/CommentInput"
import { AnonymousCheckbox } from "@features/review/ui/AnonymousCheckBox"
import { useUser } from "@shared/context/UserContext"
import { useToast } from "@shared/context/ToastContext"
import { useReviewForm } from "@features/review/models/useReviewForm"

interface ReviewFormProps {
    profileUserId: number
    profileName: string
    onSubmitSuccess: () => void
}

export const ReviewForm = ({
                               profileUserId,
                               profileName,
                               onSubmitSuccess,
                           }: ReviewFormProps) => {
    const { user, loading: userLoading } = useUser()
    const { showToast } = useToast()
    const {
        rating,
        setRating,
        text,
        setText,
        isAnonymous,
        setIsAnonymous,
        pros,
        setPros,
        cons,
        setCons,
        errors,
        loading,
        handleSubmit,
    } = useReviewForm(profileUserId, onSubmitSuccess, showToast)

    const [aspects, setAspects] = useState<ReviewAspect[]>([])

    useEffect(() => {
        getReviewAspects().then(setAspects).catch(() => setAspects([]))
    }, [])

    const toggleAspect = (id: number, target: "pros" | "cons") => {
        const list = target === "pros" ? pros : cons
        const setList = target === "pros" ? setPros : setCons
        setList(toggleItemInList(list, id))
    }

    if (userLoading)
        return <p className="py-4 text-center text-base-content/70">Загрузка...</p>

    return (
        <div className="w-full max-w-full min-w-0 px-4 md:px-6">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4 w-full min-w-0">
                <legend className="badge badge-soft badge-primary font-semibold px-4 py-2 text-xl">
                    {profileName}
                </legend>
                <form onSubmit={handleSubmit} className="space-y-5 min-w-0">
                    <div className="flex flex-col items-center space-y-4 pt-2">
                        <RatingInput value={rating} onChange={setRating} />
                    </div>
                    <AspectCheckboxList
                        label="Что понравилось?"
                        aspects={aspects.filter((a) => a.positive)}
                        selectedIds={pros}
                        onToggle={(id) => toggleAspect(id, "pros")}
                    />
                    <AspectCheckboxList
                        label="Что не понравилось?"
                        aspects={aspects.filter((a) => !a.positive)}
                        selectedIds={cons}
                        onToggle={(id) => toggleAspect(id, "cons")}
                    />
                    {user && (
                        <AnonymousCheckbox
                            value={isAnonymous}
                            onChange={setIsAnonymous}
                        />
                    )}
                    <div className="form-control w-full">
                        <CommentInput
                            value={text}
                            onChange={setText}
                            required={false}
                        />
                        {errors.text && (
                            <span className="text-error text-sm mt-1">
                                {errors.text}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            "Оставить отзыв"
                        )}
                    </button>
                </form>
            </fieldset>
        </div>
    )
}
