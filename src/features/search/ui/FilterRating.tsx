interface Props {
    rating: number | null;
    onChange: (value: number | null) => void;
}

export const FilterRating = ({ rating, onChange }: Props) => {
    const roundedRating = Math.round(rating ?? 0);

    return (
        <div className="flex items-center gap-2">
            <span className="badge bg-yellow-500 text-white text-xs sm:text-sm">
                Рейтинг
            </span>

            <div className="rating rating-md">
                {[1, 2, 3, 4, 5].map((r) => (
                    <input
                        key={r}
                        type="radio"
                        name="rating-filter"
                        className="mask mask-star bg-yellow-400"
                        aria-label={`${r} star`}
                        checked={roundedRating === r}
                        onChange={() => onChange(r)}
                    />
                ))}
            </div>

            <button
                type="button"
                className="btn btn-xs px-2"
                onClick={() => onChange(null)}
            >
                ×
            </button>
        </div>
    );
};
