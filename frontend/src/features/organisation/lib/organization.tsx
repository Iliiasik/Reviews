import type { JSX } from "react"
import { FiStar } from "react-icons/fi"

export const renderRatingStars = (rating: number): JSX.Element => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars.push(<FiStar key={i} className="fill-current text-yellow-500" size={20} />)
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars.push(<FiStar key={i} className="fill-current text-yellow-500" size={20} />)
        } else {
            stars.push(<FiStar key={i} className="text-yellow-200" size={20} />)
        }
    }

    return <div className="flex gap-1">{stars}</div>
}

export const getReviewWord = (count: number): string => {
    const lastDigit = count % 10
    const lastTwoDigits = count % 100

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "отзывов"
    if (lastDigit === 1) return "отзыв"
    if (lastDigit >= 2 && lastDigit <= 4) return "отзыва"
    return "отзывов"
}
