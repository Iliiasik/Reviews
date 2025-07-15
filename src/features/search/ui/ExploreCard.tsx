import { Link } from 'react-router-dom';

interface Props {
    id: number;
    name: string;
    type: 'specialist' | 'organization';
    rating: number;
    is_confirmed?: boolean;
    review_count: number;
}


export const ExploreCard = ({ id, name, type, rating, is_confirmed,review_count }: Props) => (
    <Link to={`/${type}/${id}`} className="card w-full bg-base-100 shadow-md hover:shadow-lg transition">
        <div className="card-body flex flex-col">
            <div className="avatar placeholder mb-4">
                <div className="bg-neutral text-neutral-content rounded-full w-24">
                    <img
                        src="https://api.dicebear.com/7.x/initials/svg?seed=user"
                        alt="Аватар"
                    />
                </div>
            </div>

            <h2 className="card-title flex items-center gap-1">
                {name}
                {is_confirmed && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </h2>

            <p className="text-sm text-gray-500">
                {type === 'specialist' ? 'Специалист' : 'Организация'} · {review_count} отзывов
            </p>

            <div className="rating rating-md mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <input
                        key={star}
                        type="radio"
                        className="mask mask-star-2 bg-orange-400"
                        checked={Math.round(rating) === star}
                        readOnly
                    />
                ))}
            </div>
        </div>
    </Link>
);
