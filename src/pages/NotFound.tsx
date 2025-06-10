import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <div className="text-8xl mb-6">😢</div>
            <h1 className="text-4xl font-bold mb-4">404 — Страница не найдена</h1>
            <p className="mb-6 text-lg">Извините, такая страница отсутствует.</p>
            <Link to="/" className="btn btn-primary">Вернуться на главную</Link>
        </main>
    );
};

export default NotFound;
