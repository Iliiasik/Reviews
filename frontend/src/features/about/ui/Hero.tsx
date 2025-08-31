import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FiEdit3, FiLayers, FiCamera } from "react-icons/fi";

export const Hero = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    const blocks = [
        "Наша платформа — пространство для честных отзывов и выбора лучших медицинских специалистов.",
        "Мы объединяем сообщество, чтобы повышать качество медицины через прозрачную обратную связь.",
        "Делитесь опытом, оценивайте услуги и находите профессионалов, которым можно доверять."
    ];

    const features = [
        { icon: <FiEdit3 className="text-2xl sm:text-3xl text-blue-500" />, text: "Оставляй отзывы" },
        { icon: <FiLayers className="text-2xl sm:text-3xl text-blue-500" />, text: "Создавай подборки" },
        { icon: <FiCamera className="text-2xl sm:text-3xl text-blue-500" />, text: "Делись QR-кодами" },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".about-title", { y: -50, opacity: 0, duration: 1.2, ease: "power4.out" });
            gsap.from(".about-description-square", { opacity: 0, y: 30, stagger: 0.25, duration: 1, delay: 0.4, ease: "power2.out" });
            gsap.from(".hero-feature", { opacity: 0, y: 20, stagger: 0.2, duration: 0.8, delay: 1.0, ease: "power2.out" });
            gsap.from(".hero-cta", { opacity: 0, y: 15, duration: 0.7, delay: 1.3, ease: "power2.out" });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-base-200 py-12 sm:py-16 px-4 sm:px-10 lg:px-20 flex flex-col items-center">
            <h1 className="about-title text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-center">
                О нас
            </h1>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-5xl mb-6 w-full">
                {blocks.map((text, idx) => (
                    <div
                        key={idx}
                        className="about-description-square bg-base-100 shadow-xl rounded-xl p-4 sm:p-6 md:p-7 w-full sm:w-[320px] md:w-[340px] flex items-center justify-center text-center text-base sm:text-lg font-medium text-base-content/90"
                        style={{ minHeight: "120px" }}
                    >
                        {text}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-6 max-w-sm sm:max-w-5xl mb-6 w-full">
                {features.map((feature, idx) => (
                    <div
                        key={idx}
                        className={`hero-feature bg-base-100 shadow-lg rounded-xl flex flex-col items-center justify-center text-center gap-2 sm:gap-3 p-3 sm:p-6 min-h-[100px] ${idx === 2 ? "col-span-2 justify-self-center sm:col-auto" : ""}`}
                    >
                        {feature.icon}
                        <span className="font-semibold text-sm sm:text-base md:text-lg">{feature.text}</span>
                    </div>
                ))}
            </div>

            <div className="hero-cta mt-2 mb-4">
                <a
                    href="/login"
                    className="btn btn-primary btn-md rounded-xl shadow-md px-6 sm:px-8 font-semibold"
                >
                    Присоединиться к платформе
                </a>
            </div>
        </section>
    );
};
