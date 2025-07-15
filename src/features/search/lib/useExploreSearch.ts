import { useEffect, useState } from 'react';
import { fetchExploreData } from '@features/search/api/explore';
import type { ExploreResult } from '@features/search/types/ExploreResult';

export const useExploreSearch = () => {
    const [rawResults, setRawResults] = useState<ExploreResult[]>([]);
    const [page, setPage] = useState(1);
    const [type, setType] = useState<'all' | 'specialist' | 'organization'>('all');
    const [rating, setRating] = useState<number | null>(null);
    const limit = 6;
    const [total, setTotal] = useState(0);
    useEffect(() => {
        fetchExploreData(type, rating, page, limit).then((data) => {
            setRawResults(data?.results ?? []);
            // Опционально:
            // можно сохранить total для пагинации из data.total
        });
    }, [type, rating, page]);
    useEffect(() => {
        fetchExploreData(type, rating, page, limit).then((data) => {
            setRawResults(data?.results ?? []);
            setTotal(data?.total ?? 0);
        });
    }, [type, rating, page]);

    const totalPages = Math.ceil(total / limit);
    return {
        results: rawResults,
        page,
        setPage,
        totalPages,
        type,
        setType,
        rating,
        setRating,
    };
};
