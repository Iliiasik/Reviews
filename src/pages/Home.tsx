import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow p-6">
                <h1 className="text-3xl font-bold mb-4">Главная страница</h1>
                <p className="mb-6">Добро пожаловать на сайт!</p>

                <button className="btn btn-primary">Нажми меня</button>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
