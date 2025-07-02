// src/api/explore.ts
import api from "@shared/axios/axios.ts";

export interface ExploreResult {
    id: number;
    name: string;
    type: 'specialist' | 'organization';
    rating: number;
}

export interface ExploreResponse {
    results: ExploreResult[];
    total: number;
    page: number;
    hasMore: boolean;
}

export async function fetchExploreData(
    type: 'all' | 'specialist' | 'organization',
    rating: number | null,
    page: number,
    limit: number
): Promise<ExploreResponse> {
    const res = await api.get('/explore', {
        params: {
            type,
            rating: rating ?? undefined,
            page,
            limit,
        },
    });

    return res.data;
}
