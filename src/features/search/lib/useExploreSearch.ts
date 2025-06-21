import { useEffect, useState } from 'react';
import { fetchExploreData } from '@features/search/api/explore';
import type { ExploreResult } from '@features/search/types/ExploreResult';

export const useExploreSearch = () => {
    const [results, setResults] = useState<ExploreResult[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [type, setType] = useState<'all' | 'specialist' | 'organization'>('all');
    const [rating, setRating] = useState<number | null>(null);
    const limit = 6;

    useEffect(() => {
        fetchExploreData(type, null, page, limit).then((data) => {
            setResults(data.results);
            setTotalPages(Math.ceil(data.total / limit));
        });
    }, [page, type]);

    // 🔽 Фронтенд-фильтрация по округлённому рейтингу
    const filteredResults = results.filter((item) => {
        if (rating === null) return true;
        return Math.round(item.rating) === rating;
    });

    return {
        results: filteredResults,
        page,
        setPage,
        totalPages,
        type,
        setType,
        rating,
        setRating,
    };
};
