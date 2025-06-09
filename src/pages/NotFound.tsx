import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <main>
            <h1>404 — Страница не найдена</h1>
            <p>Извините, такая страница отсутствует.</p>
            <Link to="/">Вернуться на главную</Link>
        </main>
    );
};

export default NotFound;
