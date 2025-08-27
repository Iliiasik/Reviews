import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-base-200 text-base-content py-4 mt-auto border-t border-base-300">
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-2 px-4">
                <p className="text-xs sm:text-sm text-center">
                    © 2025 MediRate. Все права защищены.
                </p>

                <div className="flex gap-4 text-xs sm:text-sm flex-wrap justify-center">
                    <Link to="/" className="hover:text-blue-500">Главная</Link>
                    <Link to="/about" className="hover:text-blue-500">О нас</Link>
                    <Link to="/contacts" className="hover:text-blue-500">Контакты</Link>
                </div>

                <div className="flex gap-3 text-base justify-center">
                    <a href="#" className="hover:text-blue-600"><FaFacebookF /></a>
                    <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
                    <a href="#" className="hover:text-blue-400"><FaTwitter /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
