import { MainLayout } from '@widgets/layout/MainLayout';
import  Hero  from '@features/home/ui/Hero';
import  Faq  from '@features/home/ui/Faq';
import { SearchBar } from '@features/search/ui/SearchBar';
import { SearchResultsSkeleton } from '@features/search/ui/SearchResultsSkeleton';

export const Home = () => {
    return (
        <MainLayout>
            <Hero />
            <main className="flex-grow p-6 flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-bold mb-4">Поиск специалиста или организации</h1>
                <p className="mb-6">Найдите специалиста или организацию и оставьте отзыв</p>

                <SearchBar />
                <SearchResultsSkeleton />
            </main>
            <Faq />
        </MainLayout>
    );
};