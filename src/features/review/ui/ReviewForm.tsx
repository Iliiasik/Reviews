import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { ReviewAspect } from "@features/review/types/ReviewAspect.ts";
import { getReviewAspects } from "@features/review/api/getReviewAspects.ts";
import { createReview } from "@features/review/api/createReview.ts";
import axios from "axios";
import { toggleItemInList } from "@features/review/lib/toggleItemInList.ts";
import { RatingInput } from "@features/review/ui/RatingInput.tsx";
import { AspectCheckboxList } from "@features/review/ui/AspectCheckBoxList.tsx";
import { CommentTextarea } from "@features/review/ui/CommentTextArea.tsx";
import { AnonymousCheckbox } from "@features/review/ui/AnonymousChechBox.tsx";
import { useUser } from "@shared/context/UserContext"; // ← подключаем контекст

interface ReviewFormProps {
    onSubmitSuccess: () => void;
}

export const ReviewForm = ({ onSubmitSuccess }: ReviewFormProps) => {
    const { id } = useParams();
    const { user, loading: userLoading } = useUser(); // ← получаем текущего пользователя

    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [pros, setPros] = useState<number[]>([]);
    const [cons, setCons] = useState<number[]>([]);
    const [aspects, setAspects] = useState<ReviewAspect[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getReviewAspects()
            .then(setAspects)
            .catch(() => setAspects([]));
    }, []);

    const toggleAspect = (id: number, target: "pros" | "cons") => {
        const list = target === "pros" ? pros : cons;
        const setList = target === "pros" ? setPros : setCons;
        setList(toggleItemInList(list, id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createReview({
                profile_user_id: Number(id),
                rating,
                text,
                is_anonymous: user ? isAnonymous : true, // ⬅ гость всегда анонимно
                pros,
                cons,
            });

            onSubmitSuccess();
            setRating(5);
            setText("");
            setIsAnonymous(false);
            setPros([]);
            setCons([]);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || "Ошибка отправки отзыва");
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Неизвестная ошибка");
            }
        } finally {
            setLoading(false);
        }
    };

    if (userLoading) {
        return <p>Загрузка...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
            <h3 className="text-lg font-semibold">Оставить отзыв</h3>

            {error && <div className="alert alert-error">{error}</div>}

            <RatingInput value={rating} onChange={setRating} />
            <CommentTextarea value={text} onChange={setText} />

            {user && (
                <AnonymousCheckbox value={isAnonymous} onChange={setIsAnonymous} />
            )}

            <AspectCheckboxList
                label="Плюсы"
                aspects={aspects.filter((a) => a.positive)}
                selectedIds={pros}
                onToggle={(id) => toggleAspect(id, "pros")}
            />

            <AspectCheckboxList
                label="Минусы"
                aspects={aspects.filter((a) => !a.positive)}
                selectedIds={cons}
                onToggle={(id) => toggleAspect(id, "cons")}
            />

            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Отправка..." : "Оставить отзыв"}
            </button>
        </form>
    );
};
