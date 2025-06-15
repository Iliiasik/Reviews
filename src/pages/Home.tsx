import React, {useEffect, useRef} from 'react';
import Navbar from '@components/general/Navbar.tsx';
import Footer from '@components/general/Footer.tsx';
import Hero from '@components/Home/Hero';
import Faq from '@components/Home/Faq';


const Home: React.FC = () => {
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




    return (
        <div className="flex flex-col min-h-screen mt-24">
            <Navbar />
            <Hero />
            <main className="flex-grow p-6 flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-bold mb-4">Поиск специалиста или организации</h1>
                <p className="mb-6">Найдите специалиста или организацию и оставьте отзыв</p>

                {/*поисковый бар*/}
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

                {/*скелеты карточек*/}
                <div className="grid grid-cols-1 mb:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="card w-full bg-base-100 shadow-md">
                            <div className="card-body flex flex-col ">
                                <div className="skeleton w-24 h-24 rounded-full mb-4"></div>
                                <div className="skeleton h-6 w-1/2 mb-2"></div>
                                <div className="skeleton h-4 w-full mb-2"></div>
                                <div className="skeleton h-4 w-2/3"></div>
                                <div className="rating rating-xl">
                                    <input type="radio" name="rating-9" className="mask mask-star-2 bg-orange-400" aria-label="1 star" />
                                    <input type="radio" name="rating-9" className="mask mask-star-2 bg-orange-400" aria-label="2 star" defaultChecked />
                                    <input type="radio" name="rating-9" className="mask mask-star-2 bg-orange-400" aria-label="3 star" />
                                    <input type="radio" name="rating-9" className="mask mask-star-2 bg-orange-400" aria-label="4 star" />
                                    <input type="radio" name="rating-9" className="mask mask-star-2 bg-orange-400" aria-label="5 star" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Faq />
            <Footer/>
        </div>
    );
};

export default Home;
