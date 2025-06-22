import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { fetchSearchResults } from '../api/search';
import type { SearchResult } from '../types/SearchResult';

export const useSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const debounced = useDebounce(query, 400);

    useEffect(() => {
        if (!debounced.trim()) return setResults([]);
        fetchSearchResults(debounced).then(setResults).catch(() => setResults([]));
    }, [debounced]);

    return { query, setQuery, results, isFocused, setIsFocused };
};
