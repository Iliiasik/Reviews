import  Hero  from '@features/home/ui/Hero';
import  Faq  from '@features/home/ui/Faq';
import { SearchBar } from '@features/search/ui/SearchBar';
import { MainHomeCards } from '@features/search/ui/MainHomeCards.tsx';

export const Home = () => {
    return (
        <>
            <Hero />
            <main className="flex-grow p-6 flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-bold mb-4">Поиск специалиста или организации</h1>
                <p className="mb-6">Найдите специалиста или организацию и оставьте отзыв</p>

                <SearchBar />
                <MainHomeCards />
            </main>
            <Faq />
        </>
    );
};