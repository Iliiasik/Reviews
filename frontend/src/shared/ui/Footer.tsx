import React from "react";
import { Link } from "react-router-dom";
import Logo from "@assets/images/logo.svg";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => {
    return (
        <footer className="bg-base-200 text-base-content mt-auto border-t border-base-300">
            <div className="footer sm:footer-horizontal p-10 max-w-7xl mx-auto">
                <aside>
                    <img src={Logo} alt="MediRate Logo" className="w-12 h-12" />
                    <p className="mt-2">
                        MediRate
                        <br />
                        Надежный сервис с 2025 года
                    </p>
                </aside>
                <nav>
                    <h6 className="footer-title">Навигация</h6>
                    <Link to="/" className="link link-hover">Главная</Link>
                    <Link to="/about" className="link link-hover">О нас</Link>
                    <Link to="/contacts" className="link link-hover">Контакты</Link>
                </nav>
                <nav>
                    <h6 className="footer-title">Компания</h6>
                    <a className="link link-hover" href="#">Карьера</a>
                    <a className="link link-hover" href="#">Пресса</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Правовая информация</h6>
                    <a className="link link-hover" href="#">Условия использования</a>
                    <a className="link link-hover" href="#">Политика конфиденциальности</a>
                    <a className="link link-hover" href="#">Cookies</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Мы в соцсетях</h6>
                    <div className="flex gap-3 text-lg">
                        <a href="#" className="hover:text-blue-600"><FaFacebookF /></a>
                        <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
                        <a href="#" className="hover:text-blue-400"><FaTwitter /></a>
                    </div>
                </nav>
            </div>
            <div className="border-t border-base-300 py-4">
                <p className="text-center text-xs sm:text-sm">
                    © 2025 MediRate. Все права защищены.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
