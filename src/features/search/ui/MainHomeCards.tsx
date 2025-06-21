import { useExploreSearch } from '@features/search/lib/useExploreSearch.ts';
import { FilterType } from './FilterType';
import { FilterRating } from './FilterRating';
import { ExploreCard } from './ExploreCard';
import { Pagination } from './Pagination';

export const MainHomeCards = () => {
    const {
        results,
        page,
        totalPages,
        type,
        rating,
        setPage,
        setType,
        setRating
    } = useExploreSearch();


    return (
        <div className="w-full max-w-6xl flex flex-col gap-6">
            {/* 🔍 Фильтры */}
            <div className="flex flex-wrap items-center justify-start gap-4">
                <FilterType type={type} onChange={setType} />
            </div>

            {/* 💠 Карточки */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item) => (
                    <ExploreCard key={item.id} {...item} />
                ))}
            </div>

            {/* 📄 Пагинация и фильтр по рейтингу */}
            <div className="flex justify-between items-end mt-4 flex-wrap gap-4">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                <FilterRating rating={rating} onChange={setRating} />
            </div>
        </div>
    );
};
