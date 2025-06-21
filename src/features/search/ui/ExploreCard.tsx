interface Props {
    id: number;
    name: string;
    type: 'specialist' | 'organization';
    rating: number;
}

export const ExploreCard = ({ name, type, rating }: Props) => (
    <div className="card w-full bg-base-100 shadow-md">
        <div className="card-body flex flex-col">
            <div className="avatar placeholder mb-4">
                <div className="bg-neutral text-neutral-content rounded-full w-24">
                    <span>{name[0]}</span>
                </div>
            </div>
            <h2 className="card-title">{name}</h2>
            <p className="text-sm text-gray-500">{type === 'specialist' ? 'Специалист' : 'Организация'}</p>
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
    </div>
);
