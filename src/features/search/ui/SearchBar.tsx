import { useSearchShortcut } from '../model/useSearchShortcut'
import { useSearch } from '@features/search/lib/useSearch'
import { SearchResultsDropdown } from '@features/search/ui/SearchResultDropdown'
import { SearchInput } from '@features/search/ui/SearchInput'
import { useNavigate } from "react-router-dom"
import { Head } from "./Head"

interface SearchBarProps {
    externalRef?: React.RefObject<HTMLInputElement | null>;
}

export const SearchBar = ({ externalRef }: SearchBarProps) => {
    const hotkeyRef = useSearchShortcut()
    const navigate = useNavigate()

    const {
        query,
        results,
        isFocused,
        setQuery,
        setIsFocused,
        hasMore,
        loadMore,
    } = useSearch()

    const mergedRef = externalRef || hotkeyRef

    return (
        <Head
            title="Поиск специалиста или организации"
            subtitle="Найдите специалиста или организацию и оставьте отзыв"
        >
            <div className="relative w-full max-w-2xl">
                <SearchInput
                    value={query}
                    onChange={setQuery}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                    inputRef={mergedRef}
                />
                {isFocused && query.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 z-50">
                        <SearchResultsDropdown
                            results={results}
                            hasMore={hasMore}
                            onLoadMore={loadMore}
                            onSelect={(id, type) => {
                                navigate(`/${type}/${id}`)
                            }}
                        />
                    </div>
                )}
            </div>
        </Head>
    )
}
