interface AnonymousCheckboxProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

export const AnonymousCheckbox = ({ value, onChange }: AnonymousCheckboxProps) => (
    <div className="form-control">
        <label className="cursor-pointer label">
            <span className="label-text">Оставить отзыв анонимно</span>
            <input
                type="checkbox"
                className="checkbox"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
            />
        </label>
    </div>
);
