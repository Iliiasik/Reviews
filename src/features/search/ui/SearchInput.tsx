// ui/SearchInput.tsx
// ui/SearchInput.tsx
import React from "react";

type Props = {
    value: string;
    onChange: (v: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    inputRef?: React.RefObject<HTMLInputElement | null>; // 👈 вот тут
};

export const SearchInput = ({ value, onChange, onFocus, onBlur, inputRef }: Props) => (
    <label className="input input-bordered w-full flex items-center gap-2">
        <svg className="h-5 w-5 opacity-50" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
            </g>
        </svg>
        <input
            ref={inputRef}
            type="search"
            className="grow"
            placeholder="Введите имя врача, специализацию или район"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={() => setTimeout(onBlur, 150)} // обёртка
        />
        <kbd className="kbd kbd-sm">ctrl</kbd>
        <kbd className="kbd kbd-sm">alt</kbd>
        <kbd className="kbd kbd-sm">K</kbd>
    </label>
);
