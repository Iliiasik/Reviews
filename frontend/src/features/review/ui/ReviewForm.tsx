import { useState, useEffect } from "react";
import type { ReviewAspect } from "@features/review/types/ReviewAspect.ts";
import { getReviewAspects } from "@features/review/api/getReviewAspects.ts";
import { createReview } from "@features/review/api/createReview.ts";
import axios from "axios";
import { toggleItemInList } from "@features/review/lib/toggleItemInList.ts";
import { RatingInput } from "@features/review/ui/RatingInput.tsx";
import { AspectCheckboxList } from "@features/review/ui/AspectCheckBoxList.tsx";
import { CommentInput } from "@features/review/ui/CommentInput.tsx";
import { AnonymousCheckbox } from "@features/review/ui/AnonymousCheckBox.tsx";
import { useUser } from "@shared/context/UserContext";
import { useToast } from "@shared/context/ToastContext";

interface ReviewFormProps {
    profileUserId: number;
    profileName: string;
    onSubmitSuccess: () => void;
}

export const ReviewForm = ({
                               profileUserId,
                               profileName,
                               onSubmitSuccess,
                           }: ReviewFormProps) => {
    const { user, loading: userLoading } = useUser();
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [pros, setPros] = useState<number[]>([]);
    const [cons, setCons] = useState<number[]>([]);
    const [aspects, setAspects] = useState<ReviewAspect[]>([]);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        getReviewAspects().then(setAspects).catch(() => setAspects([]));
    }, []);

    const toggleAspect = (id: number, target: "pros" | "cons") => {
        const list = target === "pros" ? pros : cons;
        const setList = target === "pros" ? setPros : setCons;
        setList(toggleItemInList(list, id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createReview({
                profile_user_id: profileUserId,
                rating,
                text,
                is_anonymous: user ? isAnonymous : true,
                pros,
                cons,
            });
            onSubmitSuccess();
            setRating(5);
            setText("");
            setIsAnonymous(false);
            setPros([]);
            setCons([]);
            showToast("Отзыв отправлен", "success");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const appError = err.response?.data;
                const message = appError?.message || appError?.error || "Ошибка отправки отзыва";
                const details = typeof appError?.details === "string" ? appError.details : "";
                showToast(`${message}${details ? `: ${details}` : ""}`, "error");
            } else if (err instanceof Error) {
                showToast(err.message, "error");
            } else {
                showToast("Неизвестная ошибка", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    if (userLoading) return <p className="py-4 text-center text-base-content/70">Загрузка...</p>;

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
                    {user && <AnonymousCheckbox value={isAnonymous} onChange={setIsAnonymous} />}
                    <CommentInput value={text} onChange={setText} required />
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            "Оставить отзыв"
                        )}
                    </button>
                </form>
            </fieldset>
        </div>
    );
};
