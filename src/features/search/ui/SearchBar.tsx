// SearchBar.tsx
import { useSearchShortcut } from '../model/useSearchShortcut';
import { useSearch } from '@features/search/lib/useSearch';
import { SearchResultsDropdown } from '@features/search/ui/SearchResultDropdown';
import { SearchInput } from '@features/search/ui/SearchInput';

export const SearchBar = () => {
    const searchInputRef = useSearchShortcut(); // тип — RefObject<HTMLInputElement | null>
    const {
        query,
        results,
        isFocused,
        setQuery,
        setIsFocused,
    } = useSearch();

    return (
        <div className="w-full px-4 mb-10 relative max-w-2xl">
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
                    onSelect={(id) => {
                        console.log('Переход к ID:', id);
                    }}
                />
            )}

            {isFocused && results.length === 0 && query.length > 0 && (
                <div className="absolute top-full z-50 mt-1 text-gray-700 text-sm bg-white border rounded-md shadow p-3 w-full">
                    Ничего не найдено
                </div>
            )}
        </div>
    );
};
