import React from 'react';

type InputProps = {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    error?: string;
    className?: string;
};

export const Input: React.FC<InputProps> = ({
                                                name,
                                                label,
                                                value,
                                                onChange,
                                                type = 'text',
                                                error,
                                                className = '',
                                            }) => (
    <div className={`form-control w-full ${className}`}>
        <div className="label pb-1">
            <span className="label-text font-medium">{label}</span>
        </div>
        <div className="relative">
            <input
                type={type}
                name={name}
                className={`input input-bordered w-full pr-10 ${
                    error ? 'input-error border-error' : ''
                }`}
                value={value}
                onChange={onChange}
            />
            {error && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                        className="h-5 w-5 text-error"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            )}
        </div>
        {error && (
            <div className="mt-1 transition-all duration-200 ease-in-out">
                <span className="text-xs text-error">{error}</span>
            </div>
        )}
    </div>
);

type TextareaProps = {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    className?: string;
    rows?: number;
};

export const Textarea: React.FC<TextareaProps> = ({
                                                      name,
                                                      label,
                                                      value,
                                                      onChange,
                                                      error,
                                                      className = '',
                                                      rows = 3,
                                                  }) => (
    <div className={`form-control w-full ${className}`}>
        <div className="label pb-1">
            <span className="label-text font-medium">{label}</span>
        </div>
        <div className="relative">
            <textarea
                name={name}
                className={`textarea textarea-bordered w-full pr-10 ${
                    error ? 'textarea-error border-error' : ''
                }`}
                value={value}
                onChange={onChange}
                rows={rows}
            />
            {error && (
                <div className="absolute top-3 right-3">
                    <svg
                        className="h-5 w-5 text-error"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            )}
        </div>
        {error && (
            <div className="mt-1 transition-all duration-200 ease-in-out">
                <span className="text-xs text-error">{error}</span>
            </div>
        )}
    </div>
);

type NumberInputProps = {
    name: string;
    label: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    className?: string;
};

export const NumberInput: React.FC<NumberInputProps> = ({
                                                            name,
                                                            label,
                                                            value,
                                                            onChange,
                                                            error,
                                                            className = '',
                                                        }) => (
    <div className={`form-control w-full ${className}`}>
        <div className="label pb-1">
            <span className="label-text font-medium">{label}</span>
        </div>
        <div className="relative">
            <input
                type="number"
                name={name}
                className={`input input-bordered w-full pr-10 ${
                    error ? 'input-error border-error' : ''
                }`}
                value={value}
                onChange={onChange}
            />
            {error && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                        className="h-5 w-5 text-error"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            )}
        </div>
        {error && (
            <div className="mt-1 transition-all duration-200 ease-in-out">
                <span className="text-xs text-error">{error}</span>
            </div>
        )}
    </div>
);