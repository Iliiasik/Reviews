import React from 'react';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher.tsx';

const Navbar: React.FC = () => {
    return (
        <div className="navbar fixed top-0 left-0 right-0 bg-base-100/70 backdrop-blur-md shadow-md z-50">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl normal-case">
                    Отзывы
                </Link>
            </div>
            <div className="flex-none lg:hidden">
                {/* Мобильное меню */}
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        <li><ThemeSwitcher /></li>
                        <li><Link to="/">Главная</Link></li>
                        <li><Link to="/about">О нас</Link></li>
                        <li><Link to="/contacts">Контакты</Link></li>
                        <li><Link to="/login">Логин</Link></li>
                    </ul>
                </div>
            </div>
            <div className="hidden lg:flex flex-none">
                <ul className="menu menu-horizontal px-1 gap-2 items-center">
                    <li><ThemeSwitcher /></li>
                    <li><Link to="/">Главная</Link></li>
                    <li><Link to="/about">О нас</Link></li>
                    <li><Link to="/contacts">Контакты</Link></li>
                    <li><Link to="/login">Логин</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
