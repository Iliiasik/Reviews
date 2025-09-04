interface CommentInputProps {
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    className?: string;
}

export const CommentInput = ({
                                 value,
                                 onChange,
                                 required = false,
                                 className = "",
                             }: CommentInputProps) => (
    <div className="form-control w-full">
        <input
            type="text"
            placeholder="Напишите ваш отзыв..."
            className={`input input-bordered w-full ${className}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
        />
    </div>
);
