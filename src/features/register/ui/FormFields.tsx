import React from 'react';

type InputProps = {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
};

export const Input: React.FC<InputProps> = ({
                                                name,
                                                label,
                                                value,
                                                onChange,
                                                type = 'text',
                                            }) => (
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

type TextareaProps = {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const Textarea: React.FC<TextareaProps> = ({
                                                      name,
                                                      label,
                                                      value,
                                                      onChange,
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
            required
        />
    </label>
);
