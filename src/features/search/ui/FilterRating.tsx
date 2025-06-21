interface Props {
    rating: number | null;
    onChange: (value: number | null) => void;
}

export const FilterRating = ({ rating, onChange }: Props) => {
    const roundedRating = Math.round(rating ?? 0);

    return (
        <div className="flex flex-col items-end">
            <span className="mb-1 text-sm text-gray-600">Рейтинг</span>
            <form className="filter gap-2">
                <input className="btn btn-square" type="reset" value="×" onClick={() => onChange(null)} />
                {[1, 2, 3, 4, 5].map((r) => (
                    <input
                        key={r}
                        className={`btn ${roundedRating === r ? 'btn-active' : ''}`}
                        type="radio"
                        name="rating"
                        aria-label={String(r)}
                        onClick={() => onChange(r)}
                    />
                ))}
            </form>
        </div>
    );
};
