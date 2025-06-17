export const SearchResultsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 mb:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card w-full bg-base-100 shadow-md">
                    <div className="card-body flex flex-col">
                        <div className="skeleton w-24 h-24 rounded-full mb-4"></div>
                        <div className="skeleton h-6 w-1/2 mb-2"></div>
                        <div className="skeleton h-4 w-full mb-2"></div>
                        <div className="skeleton h-4 w-2/3"></div>
                        <div className="rating rating-xl">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <input
                                    key={star}
                                    type="radio"
                                    name="rating-9"
                                    className="mask mask-star-2 bg-orange-400"
                                    aria-label={`${star} star`}
                                    defaultChecked={star === 2}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};