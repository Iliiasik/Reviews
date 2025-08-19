import { useRef } from 'react'
import Faq from '@features/home/ui/Faq'
import { SearchBar } from '@features/search/ui/SearchBar'
import { MainHomeCards } from '@features/search/ui/MainHomeCards'

export const Home = () => {
    const searchInputRef = useRef<HTMLInputElement>(null)

    return (
        <>
            <SearchBar externalRef={searchInputRef} />
            <main className="flex-grow p-6 flex flex-col items-center justify-center text-center">
                <MainHomeCards />
            </main>
            <Faq />
        </>
    )
}
