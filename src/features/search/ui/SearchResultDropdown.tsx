import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Result {
    id: number;
    name: string;
    type: 'specialist' | 'organization';
}

interface Props {
    results: Result[];
    onSelect: (id: number, type: 'specialist' | 'organization') => void;
    onLoadMore: () => void;
    hasMore: boolean;
}

export const SearchResultsDropdown: React.FC<Props> = ({ results, onSelect, onLoadMore, hasMore }) => {
    const navigate = useNavigate();
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const el = listRef.current;
            if (!el || !hasMore) return;

            const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
            if (nearBottom) {
                onLoadMore();
            }
        };

        const el = listRef.current;
        el?.addEventListener('scroll', handleScroll);
        return () => el?.removeEventListener('scroll', handleScroll);
    }, [hasMore, onLoadMore]);

    return (
        <ul
            ref={listRef}
            className="absolute z-50 mt-2 w-full max-h-64 overflow-auto rounded-md border border-base-300 bg-base-100 text-base-content shadow-lg"
        >
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
                        key={`${r.type}-${r.id}`}
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

            {hasMore && (
                <li className="p-3 text-center text-base-content/50 italic">Загрузка...</li>
            )}
        </ul>
    );
};
