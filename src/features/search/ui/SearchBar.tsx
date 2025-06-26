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
                    onBlur={() => {
                        setTimeout(() => {
                            setIsFocused(false);
                        }, 150); // 100–150мс хватает
                    }}                    inputRef={searchInputRef}
                />

                {isFocused && query.length > 0 && (
                    <SearchResultsDropdown
                        results={results}
                        onSelect={(id, type) => {
                            navigate(`/${type}/${id}`);
                        }}
                    />
                )}

            </div>
        </div>
    );
};
