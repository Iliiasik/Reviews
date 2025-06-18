// src/components/Register/FormFields.tsx
export const Input = ({ name, label, value, onChange, type = 'text' }: any) => (
    <label className="form-control w-full">
        <div className="label m-2">
            <span className="label-text">{label}</span>
        </div>
        <input
            type={type}
            name={name}
            className="input input-bordered w-full"
            value={value}
            onChange={onChange}
            required
        />
    </label>
);

export const Textarea = ({ name, label, value, onChange }: any) => (
    <label className="form-control w-full">
        <div className="label m-2">
            <span className="label-text">{label}</span>
        </div>
        <textarea
            name={name}
            className="textarea textarea-bordered w-full"
            value={value}
            onChange={onChange}
            required
        />
    </label>
);
