// SearchBar.tsx
import { useSearchShortcut } from '../model/useSearchShortcut';
import { useSearch } from '@features/search/lib/useSearch';
import { SearchResultsDropdown } from '@features/search/ui/SearchResultDropdown';
import { SearchInput } from '@features/search/ui/SearchInput';
import {useNavigate} from "react-router-dom";

export const SearchBar = () => {
    const searchInputRef = useSearchShortcut();
    const navigate = useNavigate();
    const {
        query,
        results,
        isFocused,
        setQuery,
        setIsFocused,
    } = useSearch();

    return (
        <div className="w-full mb-10 px-4">
            <div className="relative w-full max-w-2xl mx-auto">
                <SearchInput
                    value={query}
                    onChange={setQuery}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    inputRef={searchInputRef}
                />

                {isFocused && results.length > 0 && (
                    <SearchResultsDropdown
                        results={results}
                        onSelect={(id,type) => {
                            navigate(`/${type}/${id}`);
                        }}
                    />
                )}

                {isFocused && results.length === 0 && query.length > 0 && (
                    <div className="absolute top-full z-50 mt-1 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-base-300 border border-gray-300 dark:border-gray-600 rounded-md shadow p-3 w-full">
                        Ничего не найдено
                    </div>
                )}
            </div>
        </div>
    );
};
