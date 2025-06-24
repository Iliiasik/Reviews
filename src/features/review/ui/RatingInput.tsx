interface RatingInputProps {
    value: number;
    onChange: (value: number) => void;
}

export const RatingInput = ({ value, onChange }: RatingInputProps) => (
    <div className="form-control">
        <label className="label">
            <span className="label-text">Оценка</span>
        </label>
        <div className="rating rating-md">
            {[1, 2, 3, 4, 5].map((r) => (
                <input
                    key={r}
                    type="radio"
                    name="rating"
                    className="mask mask-star-2 bg-yellow-400"
                    value={r}
                    checked={value === r}
                    onChange={() => onChange(r)}
                />
            ))}
        </div>
    </div>
);
