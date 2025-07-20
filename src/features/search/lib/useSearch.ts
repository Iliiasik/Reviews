import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { fetchSearchResults } from '../api/search';
import type { SearchResult } from '../types/SearchResult';

const LIMIT = 10;

export const useSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const debounced = useDebounce(query, 400);

    const fetchInitial = useCallback(async () => {
        setLoading(true);
        try {
            const { results: newResults, total } = await fetchSearchResults(debounced, LIMIT, 0);
            setResults(newResults);
            setOffset(newResults.length);
            setHasMore(newResults.length < total);
        } catch {
            setResults([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [debounced]);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const { results: moreResults, total } = await fetchSearchResults(debounced, LIMIT, offset);
            setResults(prev => [...prev, ...moreResults]);
            setOffset(prev => prev + moreResults.length);
            setHasMore(offset + moreResults.length < total);
        } catch {
            // handle error silently
        } finally {
            setLoading(false);
        }
    }, [debounced, offset, hasMore, loading]);


    useEffect(() => {
        if (!debounced.trim()) {
            setResults([]);
            setHasMore(false);
            setOffset(0);
            return;
        }

        fetchInitial();
    }, [debounced, fetchInitial]);

    return {
        query,
        setQuery,
        results,
        isFocused,
        setIsFocused,
        hasMore,
        loadMore,
        loading,
    };
};
