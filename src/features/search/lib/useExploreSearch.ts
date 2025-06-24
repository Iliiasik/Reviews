import { useEffect, useMemo, useState } from 'react';
import { fetchExploreData } from '@features/search/api/explore';
import type { ExploreResult } from '@features/search/types/ExploreResult';

export const useExploreSearch = () => {
    const [rawResults, setRawResults] = useState<ExploreResult[]>([]);
    const [page, setPage] = useState(1);
    const [type, setType] = useState<'all' | 'specialist' | 'organization'>('all');
    const [rating, setRating] = useState<number | null>(null);
    const limit = 6;

    useEffect(() => {
        fetchExploreData(type, null, 1, 1000).then((data) => {
            setRawResults(data?.results ?? []);
        });
    }, [type]);

    const filteredResults = useMemo(() => {
        return rawResults.filter((item) => {
            if (rating !== null && Math.round(item.rating) !== rating) return false;
            return true;
        });
    }, [rawResults, rating]);

    const totalPages = Math.ceil(filteredResults.length / limit);

    // сбрасываем page, если он выходит за пределы
    useEffect(() => {
        if (page > totalPages) {
            setPage(1);
        }
    }, [page, totalPages]);

    const paginatedResults = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredResults.slice(start, start + limit);
    }, [filteredResults, page]);

    return {
        results: paginatedResults,
        page,
        setPage,
        totalPages,
        type,
        setType,
        rating,
        setRating,
    };
};
