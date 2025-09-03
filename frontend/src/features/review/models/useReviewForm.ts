import { useState } from "react"
import * as yup from "yup"
import { createReview } from "@features/review/api/createReview"
import type { CreateReviewPayload } from "@features/review/types/Review"

const reviewSchema = yup.object().shape({
    text: yup.string().max(500, "Максимум 500 символов").notRequired(),
})

export const useReviewForm = (
    profileUserId: number,
    onSubmitSuccess: () => void,
    showToast: (msg: string, type: "success" | "error") => void
) => {
    const [rating, setRating] = useState(5)
    const [text, setText] = useState("")
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [pros, setPros] = useState<number[]>([])
    const [cons, setCons] = useState<number[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)

    const validateForm = async () => {
        try {
            await reviewSchema.validate({ text }, { abortEarly: false })
            return true
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const newErrors = err.inner.reduce((acc, curr) => {
                    if (curr.path) acc[curr.path] = curr.message
                    return acc
                }, {} as Record<string, string>)
                setErrors(newErrors)
            }
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setLoading(true)

        try {
            const isValid = await validateForm()
            if (!isValid) {
                throw new Error("Пожалуйста, исправьте ошибки в форме")
            }

            const payload: CreateReviewPayload = {
                profile_user_id: profileUserId,
                rating,
                text: text.trim() || undefined,
                is_anonymous: isAnonymous,
                pros,
                cons,
            }

            await createReview(payload)
            onSubmitSuccess()
            setRating(5)
            setText("")
            setIsAnonymous(false)
            setPros([])
            setCons([])
            showToast("Отзыв отправлен", "success")
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Ошибка при отправке"
            showToast(message, "error")
        } finally {
            setLoading(false)
        }
    }

    return {
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
    }
}
