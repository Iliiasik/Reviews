import { Link } from 'react-router-dom'
import { BsPatchCheckFill } from 'react-icons/bs'
import { FiStar, FiUser, FiHome } from 'react-icons/fi'
import { useRating } from '../lib/useRating'

interface Props {
    id: number
    name: string
    type: 'specialist' | 'organization'
    rating: number
    is_confirmed?: boolean
    review_count: number
    avatar_url?: string | null
}

export const ExploreCard = ({
                                id,
                                name,
                                type,
                                rating,
                                is_confirmed,
                                review_count,
                                avatar_url
                            }: Props) => {
    const { getReviewWord } = useRating()
    const roundedRating = Math.round(rating)

    return (
        <Link
            to={`/${type}/${id}`}
            className="card w-full bg-base-100 shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-0.5"
        >
            <div className="card-body flex flex-col justify-between h-full p-4">
                <div className="flex items-start gap-4">
                    <div className="avatar flex-shrink-0">
                        <div className="w-24 h-24 rounded-xl overflow-hidden">
                            <img
                                src={
                                    avatar_url ||
                                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
                                }
                                alt="Аватар"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h2 className="font-semibold text-base sm:text-lg md:text-xl truncate">{name}</h2>
                        {is_confirmed && (
                            <div className="flex items-center gap-1 mt-0.5 text-blue-600 font-medium truncate text-xs sm:text-sm">
                                <BsPatchCheckFill className="text-blue-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>{type === 'specialist' ? 'Профиль подтверждён' : 'Организация подтверждена'}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1 text-sm sm:text-base text-gray-500 mt-0.5 truncate">
                            {type === 'specialist' ? <FiUser className="w-4 h-4" /> : <FiHome className="w-4 h-4" />}
                            <span>{type === 'specialist' ? 'Специалист' : 'Организация'}</span>
                        </div>
                    </div>
                </div>

                <div className="divider my-1"></div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                                key={star}
                                size={16}
                                className={star <= roundedRating ? 'fill-current text-yellow-500' : 'text-yellow-200'}
                            />
                        ))}
                        <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        {review_count} {getReviewWord(review_count)}
                    </div>
                </div>
            </div>
        </Link>
    )
}
