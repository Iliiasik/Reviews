// src/components/Hero.tsx
import React from 'react';

const Hero: React.FC = () => {
    return (
        <div className="hero min-h-[300px] bg-base-200 rounded-lg shadow mb-10 animate-pulse">
            <div className="hero-content flex-col lg:flex-row-reverse gap-10">
                <div className="skeleton w-64 h-64 rounded-lg"></div>
                <div>
                    <div className="skeleton h-8 w-64 mb-4"></div>
                    <div className="skeleton h-4 w-96 mb-2"></div>
                    <div className="skeleton h-4 w-80 mb-2"></div>
                    <div className="skeleton h-4 w-72 mb-4"></div>
                    <div className="skeleton h-10 w-32 rounded"></div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
