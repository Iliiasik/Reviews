interface CommentTextareaProps {
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

export const CommentTextarea = ({ value, onChange, required = false }: CommentTextareaProps) => (
    <div className="form-control w-full">
        <textarea
            placeholder="Комментарий"
            className="textarea textarea-bordered w-full min-h-[100px] sm:min-h-[160px] resize-none p-2 text-sm leading-snug placeholder:text-gray-400"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
        />
    </div>
);
