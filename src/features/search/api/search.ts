import type { SearchResult } from '@features/search/types/SearchResult';
import api from "@shared/axios/axios.ts";

export async function fetchSearchResults(
    query: string,
    limit: number,
    offset: number
): Promise<{ results: SearchResult[]; total: number }> {
    try {
        const res = await api.get('/search', {
            params: { q: query, limit, offset },
        });

        // Предполагаем, что сервер возвращает объект с total и results
        return {
            results: Array.isArray(res.data.results) ? res.data.results : [],
            total: typeof res.data.total === 'number' ? res.data.total : 0,
        };
    } catch (err) {
        console.error(err);
        return { results: [], total: 0 };
    }
}

