import type { SearchResult } from '@features/search/types/SearchResult';
import api from "@shared/axios/axios.ts";

export async function fetchSearchResults(
    query: string,
    limit: number,
    offset: number
): Promise<SearchResult[]> {
    try {
        const res = await api.get('/search', {
            params: {
                q: query,
                limit,
                offset,
            },
        });
        return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
