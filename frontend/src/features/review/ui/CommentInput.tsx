interface CommentInputProps {
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

export const CommentInput = ({ value, onChange, required = false }: CommentInputProps) => (
    <div className="form-control w-full">
        <input
            type="text"
            placeholder="Напишите ваш отзыв..."
            className="input input-bordered w-full h-12 sm:h-14 text-base input-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-transparent px-3 sm:px-4"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
        />
    </div>
);
