import React from 'react';
import ReviewsSvg from "@assets/undraw_reviews_ukai.svg";

interface HeroProps {
    onSearchClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSearchClick }) => {
    return (
        <div className="hero min-h-[300px] bg-base-200 rounded-lg shadow mb-10">
            <div className="hero-content flex-col lg:flex-row-reverse gap-10">
                <img
                    src={ReviewsSvg}
                    alt="Отзывы"
                    className="w-64 h-64 object-contain"
                />
                <div>
                    <h1 className="text-4xl font-bold text-base-content mb-4">
                        Делитесь впечатлениями о специалистах и организациях
                    </h1>
                    <p className="text-base-content/80 mb-2">
                        Мы помогаем другим находить лучших профессионалов по честным отзывам.
                    </p>
                    <p className="text-base-content/80 mb-4">
                        Оставьте свой отзыв, чтобы поддержать любимого специалиста или улучшить сервис.
                    </p>
                    <button onClick={onSearchClick} className="btn btn-primary">
                        Найти специалиста
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
