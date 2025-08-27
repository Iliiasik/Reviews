export const Textarea = ({
                             name,
                             label,
                             value,
                             onChange,
                             required = true
                         }: {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
}) => (
    <label className="form-control w-full">
        <div className="label m-2">
            <span className="label-text">{label}</span>
        </div>
        <textarea
            name={name}
            className="textarea textarea-bordered w-full"
            value={value}
            onChange={onChange}
            required={required}
        />
    </label>
);