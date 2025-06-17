import { useSearchShortcut } from '../model/useSearchShortcut';

export const SearchBar = () => {
    const searchInputRef = useSearchShortcut();

    return (
        <div className="w-full px-4 mb-10">
            <label className="input input-bordered w-full flex items-center gap-2">
                <svg className="h-5 w-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input
                    ref={searchInputRef}
                    type="search"
                    className="grow"
                    placeholder="Введите имя врача, специализацию или район"
                />
                <kbd className="kbd kbd-sm">ctrl</kbd>
                <kbd className="kbd kbd-sm">alt</kbd>
                <kbd className="kbd kbd-sm">K</kbd>
            </label>
        </div>
    );
};