import axios from 'axios';
import type { SearchResult } from '@features/search/types/SearchResult';

export async function fetchSearchResults(query: string): Promise<SearchResult[]> {
    try {
        const res = await axios.get('/api/search', { params: { q: query } });
        return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
