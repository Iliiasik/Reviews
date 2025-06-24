interface CommentTextareaProps {
    value: string;
    onChange: (value: string) => void;
}

export const CommentTextarea = ({ value, onChange }: CommentTextareaProps) => (
    <div className="form-control">
        <textarea
            placeholder="Комментарий"
            className="textarea textarea-bordered placeholder:text-gray-400"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
        />
    </div>
);
