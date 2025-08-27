export const useRating = () => {
    const getReviewWord = (count: number) => {
        const mod10 = count % 10
        const mod100 = count % 100

        if (mod100 >= 11 && mod100 <= 14) return 'отзывов'
        if (mod10 === 1) return 'отзыв'
        if (mod10 >= 2 && mod10 <= 4) return 'отзыва'
        return 'отзывов'
    }

    return { getReviewWord }
}