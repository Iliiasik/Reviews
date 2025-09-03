interface AnonymousCheckboxProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

export const AnonymousCheckbox = ({ value, onChange }: AnonymousCheckboxProps) => (
    <div className="form-control">
        <label className="cursor-pointer label justify-start gap-3 p-0">
            <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className="label-text text-sm sm:text-base">Оставить отзыв анонимно</span>
        </label>
    </div>
);