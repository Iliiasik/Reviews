import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Result {
    id: number;
    name: string;
    type: 'specialist' | 'organization';
}

interface Props {
    results: Result[];
    onSelect: (id: number, type: 'specialist' | 'organization') => void;
}

export const SearchResultsDropdown: React.FC<Props> = ({ results, onSelect }) => {
    const navigate = useNavigate();

    return (
        <ul className="absolute z-50 mt-2 w-full max-h-64 overflow-auto rounded-md border border-base-300 bg-base-100 text-base-content shadow-lg">
            {/* Этот пункт ВСЕГДА СВЕРХУ */}
            <li
                onClick={() => navigate('/new-unverified')}
                className="p-3 text-left cursor-pointer hover:bg-base-200 border-b border-base-300 font-medium text-primary"
            >
                Не нашли организацию или специалиста?{' '}
                <span className="text-sm text-base-content/70">(добавить профиль)</span>
            </li>

            {results.length > 0 ? (
                results.map((r) => (
                    <li
                        key={r.id}
                        onClick={() => onSelect(r.id, r.type)}
                        className="p-3 text-left cursor-pointer hover:bg-base-200"
                    >
                        {r.name}{' '}
                        <span className="text-sm text-base-content/70">
                            ({r.type === 'specialist' ? 'Специалист' : 'Организация'})
                        </span>
                    </li>
                ))
            ) : (
                <li className="p-3 text-left text-base-content/70 italic">Ничего не найдено</li>
            )}
        </ul>
    );
};

