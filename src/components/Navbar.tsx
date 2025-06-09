import React from 'react';

const Navbar: React.FC = () => {
    return (
        <div className="navbar bg-base-100 shadow-md">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Отзывы</a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li><a>Главная</a></li>
                    <li><a>О нас</a></li>
                    <li><a>Контакты</a></li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
