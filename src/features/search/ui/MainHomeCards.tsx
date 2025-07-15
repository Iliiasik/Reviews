import { useExploreSearch } from '@features/search/lib/useExploreSearch.ts';
import { FilterType } from './FilterType';
import { FilterRating } from './FilterRating';
import { ExploreCard } from './ExploreCard';
import { Pagination } from './Pagination';

import { AnimatePresence, motion } from 'framer-motion';

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
        <div className="w-full max-w-6xl flex flex-col gap-6 transition-all duration-300 ease-in-out">

            <div className="flex flex-wrap items-center justify-start gap-4 transition-all duration-200">
                <FilterType
                    type={type}
                    onChange={(newType) => {
                        setType(newType);
                        setPage(1);
                    }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={`${type}-${rating}-${page}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {results.map((item) => (
                        <ExploreCard review_count={0} key={item.id} {...item} />
                    ))}
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-end mt-4 flex-wrap gap-4 transition-all duration-200">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                <FilterRating
                    rating={rating}
                    onChange={(newRating) => {
                        setRating(newRating);
                        setPage(1);
                    }}
                />
            </div>
        </div>
    );
};
