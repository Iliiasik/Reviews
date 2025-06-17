export const Input = ({
                          label,
                          name,
                          type = 'text',
                          value,
                          onChange,
                          disabled,
                          error,
                          placeholder = '',
                      }: {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    error?: boolean;
    placeholder?: string;
}) => (
    <label className="form-control w-full">
        <div className="label m-2">
            <span className="label-text">{label}</span>
        </div>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required
        />
    </label>
);