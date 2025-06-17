import { useEffect, useRef } from 'react';

export const useSearchShortcut = () => {
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().includes('MAC');
            const isSearchShortcut =
                (isMac && event.metaKey && event.altKey && event.key.toLowerCase() === 'k') ||
                (!isMac && event.ctrlKey && event.altKey && event.key.toLowerCase() === 'k');

            if (isSearchShortcut) {
                const activeTag = document.activeElement?.tagName;
                if (['INPUT', 'TEXTAREA'].includes(activeTag ?? '') || (document.activeElement as HTMLElement)?.isContentEditable) return;

                event.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return searchInputRef;
};