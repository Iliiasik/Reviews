import React from 'react';

interface Result {
    id: number;
    name: string;
    type: 'specialist' | 'organization';
}

interface Props {
    results: Result[];
    onSelect: (id: number) => void;
}

export const SearchResultsDropdown: React.FC<Props> = ({ results, onSelect }) => {
    if (!results.length) return null;

    return (
        <ul className="absolute z-50 mt-2 bg-white shadow-lg border w-full rounded-md overflow-auto max-h-64">
        {results.map((r) => (
                <li
                    key={r.id}
                    onClick={() => onSelect(r.id)}
                    className="p-3 hover:bg-gray-100 cursor-pointer text-left text-black"
                >
                    {r.name}{' '}
                    <span className="text-sm text-gray-500">
                        ({r.type === 'specialist' ? 'Специалист' : 'Организация'})
                    </span>
                </li>
            ))}
        </ul>
    );
};
