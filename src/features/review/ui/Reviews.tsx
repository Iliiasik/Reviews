import { useUser } from '@shared/context/UserContext.tsx'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getReviews } from '@features/review/api/getReviews.ts'
import { likeReview } from '@features/review/api/likeReview.ts'
import { unlikeReview } from '@features/review/api/unlikeReview.ts'
import { FiStar, FiThumbsUp, FiThumbsDown, FiChevronDown, FiPlus } from 'react-icons/fi'
import { FaRegCommentDots } from 'react-icons/fa'
import { ReviewAspectCard } from './ReviewAspectCard'

interface ReviewAspect { id: number; description: string }
interface ReviewsProps { type: 'specialist' | 'organization' }
interface Author { id: number; name: string; avatar_url: string }
interface Review {
    id: number
    author: Author | null
    rating: number
    text: string
    created_at: string
    pros: ReviewAspect[]
    cons: ReviewAspect[]
    usefulCount?: number
    userHasLiked?: boolean
}

export const Reviews = ({ type }: ReviewsProps) => {
    const { id: profileId } = useParams()
    const { user, loading: userLoading } = useUser()

    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [disabledLikes, setDisabledLikes] = useState<{ [key: number]: boolean }>({})
    const [openAspects, setOpenAspects] = useState<{ [key: number]: 'pros' | 'cons' | null }>({})

    const handleUsefulClick = async (reviewId: number, hasLiked: boolean) => {
        if (disabledLikes[reviewId]) return
        setDisabledLikes(prev => ({ ...prev, [reviewId]: true }))
        try {
            if (hasLiked) {
                await unlikeReview(reviewId)
                setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, usefulCount: Math.max((r.usefulCount ?? 1) - 1, 0), userHasLiked: false } : r))
            } else {
                await likeReview(reviewId)
                setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, usefulCount: (r.usefulCount ?? 0) + 1, userHasLiked: true } : r))
            }
        } finally {
            setTimeout(() => setDisabledLikes(prev => ({ ...prev, [reviewId]: false })), 1000)
        }
    }

    useEffect(() => {
        getReviews(profileId as string)
            .then(setReviews)
            .catch(err => setError(err.response?.data?.error || err.message))
            .finally(() => setLoading(false))
    }, [profileId])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (!target.closest('.review-aspects-container')) setOpenAspects({})
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    const isOwnProfile = user?.id?.toString() === profileId

    return (
        <section className="w-full mt-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-base-content">Отзывы</h2>
                    {!userLoading && !isOwnProfile && (
                        <Link to={`/${type}/${profileId}/add-review`} className="btn btn-primary flex items-center gap-2">
                            <FiPlus size={18} /> Оставить отзыв
                        </Link>
                    )}
                </div>

                {loading && <div className="space-y-6">{[...Array(3)].map((_, i) => <div key={i} className="animate-pulse bg-base-200 rounded-xl h-48"></div>)}</div>}
                {error && <p className="text-center text-error py-8">Ошибка: {error}</p>}
                {!loading && !error && reviews.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-12 rounded-xl border-2 border-dashed border-base-300 bg-base-200/60 text-center">
                        <FaRegCommentDots className="text-5xl text-primary mb-4" />
                        <p className="text-gray-500 text-lg">Пользователи пока не делились впечатлениями</p>
                    </div>
                )}

                {!loading && !error && reviews.length > 0 && (
                    <div className="space-y-6">
                        {reviews.map(review => {
                            const formattedDate = new Date(review.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })
                            const rating = Math.round(review.rating)
                            return (
                                <div key={review.id} className="card bg-base-100 border-2 border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    <div className="card-body p-6 review-aspects-container">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                                            <div className="flex items-start gap-4 min-w-0 flex-1">
                                                <div className="avatar flex-shrink-0">
                                                    <div className="w-16 rounded-full">
                                                        <img src={review.author?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${review.author?.name || 'anon'}`} alt="Аватар" className="object-cover" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-lg">{review.author?.name || 'Аноним'}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex items-center gap-1 text-yellow-500">
                                                            <span className="font-semibold">{rating}</span>
                                                            <FiStar size={16} className="fill-current" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3 justify-start sm:justify-end">
                                                {review.pros.length > 0 && (
                                                    <button
                                                        onClick={e => { e.stopPropagation(); setOpenAspects(prev => ({ ...prev, [review.id]: prev[review.id] === 'pros' ? null : 'pros' })) }}
                                                        className={`btn btn-xs sm:btn-sm flex items-center gap-2 transition ${openAspects[review.id] === 'pros' ? 'btn-success' : 'btn-outline btn-success'}`}
                                                    >
                                                        <FiThumbsUp size={16} />
                                                        <span>{review.pros.length}</span>
                                                        <FiChevronDown size={14} className={`transition-transform ${openAspects[review.id] === 'pros' ? 'rotate-180' : ''}`} />
                                                    </button>
                                                )}
                                                {review.cons.length > 0 && (
                                                    <button
                                                        onClick={e => { e.stopPropagation(); setOpenAspects(prev => ({ ...prev, [review.id]: prev[review.id] === 'cons' ? null : 'cons' })) }}
                                                        className={`btn btn-xs sm:btn-sm flex items-center gap-2 transition ${openAspects[review.id] === 'cons' ? 'btn-error' : 'btn-outline btn-error'}`}
                                                    >
                                                        <FiThumbsDown size={16} />
                                                        <span>{review.cons.length}</span>
                                                        <FiChevronDown size={14} className={`transition-transform ${openAspects[review.id] === 'cons' ? 'rotate-180' : ''}`} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {openAspects[review.id] === 'pros' && (
                                            <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {review.pros.map(pro => <ReviewAspectCard key={pro.id} aspect={pro} />)}
                                            </div>
                                        )}
                                        {openAspects[review.id] === 'cons' && (
                                            <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {review.cons.map(con => <ReviewAspectCard key={con.id} aspect={con} />)}
                                            </div>
                                        )}

                                        <p className="text-base text-base-content mb-4 break-words whitespace-pre-line">{review.text}</p>

                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 border-t border-base-300">
                                            <div className="tooltip tooltip-right" data-tip="Был ли отзыв полезен?">
                                                <button
                                                    disabled={disabledLikes[review.id] || !user}
                                                    onClick={() => handleUsefulClick(review.id, review.userHasLiked ?? false)}
                                                    className={`flex items-center gap-1 text-sm transition ${review.userHasLiked ? 'text-blue-600' : 'text-base-content/70 hover:text-base-content'}`}
                                                >
                                                    <FiThumbsUp size={16} /> <span>{review.usefulCount ?? 0}</span>
                                                </button>
                                            </div>
                                            <span className="text-base-content/60 text-sm">{formattedDate}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
