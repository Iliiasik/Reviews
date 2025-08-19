import React from "react"
import ReviewsSvg from "@assets/home.jpg"

interface HeadProps {
    title: string
    subtitle?: string
    children?: React.ReactNode
}

export const Head: React.FC<HeadProps> = ({ title, subtitle, children }) => {
    return (
        <section className="w-full flex justify-center px-4 pt-2 pb-6">
            <div className="relative w-full max-w-5xl">
                <div className="rounded-xl overflow-hidden h-48 sm:h-56 md:h-64 lg:h-72">
                    <img
                        src={ReviewsSvg}
                        alt="background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 p-3 sm:p-4 md:p-6 flex flex-col gap-1 sm:gap-2 md:gap-3 text-left z-20">
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold text-black mb-1">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-black/80 mb-2">
                            {subtitle}
                        </p>
                    )}
                    {children}
                </div>
            </div>
        </section>
    )
}
