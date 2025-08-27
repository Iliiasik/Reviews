import React from "react";

type Props = {
    value: string;
    onChange: (v: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    inputRef?: React.RefObject<HTMLInputElement | null>;
};

export const SearchInput = ({ value, onChange, onFocus, onBlur, inputRef }: Props) => (
    <label className="input input-bordered w-full flex items-center gap-2 rounded-full text-xs sm:text-sm md:text-base lg:text-sm xl:text-base">
        <svg className="h-3 w-3 sm:h-4 sm:w-4 md:h-3 md:w-3 lg:h-3 lg:w-3 xl:h-4 xl:w-4 opacity-50" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </g>
        </svg>

        <input
            ref={inputRef}
            type="search"
            className="grow py-1 sm:py-1 md:py-0.5 lg:py-0.5 xl:py-1"
            placeholder="Врач, специализация, организация"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={() => setTimeout(onBlur, 150)}
        />
    </label>
);
