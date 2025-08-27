import React from "react"
import ReviewsSvg from "@assets/images/head.svg"
import HeadBgSvg from "@assets/images/background.svg"

interface HeadProps {
    title: string
    subtitle?: string
    children?: React.ReactNode
}

export const Head: React.FC<HeadProps> = ({ title, subtitle, children }) => {
    return (
        <section className="w-full flex justify-center px-4 pt-2 pb-6">
            <div className="relative w-full max-w-5xl">
                <div
                    className="rounded-xl overflow-hidden w-full"
                    style={{ height: 200 }}
                >
                    <img
                        src={HeadBgSvg}
                        alt="background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <img
                    src={ReviewsSvg}
                    alt="logo"
                    className="absolute top-1/2 right-8 transform -translate-y-1/2"
                    style={{ height: 140 }}
                />
                <div className="absolute inset-0 px-4 sm:px-6 md:px-8 flex flex-col justify-center gap-2 sm:gap-3 md:gap-4 z-20">
                    <h1 className="text-black text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-black text-xs sm:text-sm md:text-base lg:text-lg">
                            {subtitle}
                        </p>
                    )}
                    {children}
                </div>
            </div>
        </section>
    )
}