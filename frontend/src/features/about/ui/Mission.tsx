import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Mission = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const squares = [
        {
            title: "Честная обратная связь",
            text: "Все отзывы проходят модерацию и публикуются прозрачно, чтобы пользователи могли доверять информации.",
        },
        {
            title: "Безопасность и анонимность",
            text: "Платформа обеспечивает приватность и защищает личные данные каждого пользователя.",
        },
        {
            title: "Объективный выбор",
            text: "Ориентируйтесь на реальные истории и оценки, чтобы принимать лучшие решения.",
        },
        {
            title: "Рост профессионализма",
            text: "Открытая информация способствует повышению качества услуг и развитию медицинской отрасли.",
        },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>(".mission-square").forEach((el, i) => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                    opacity: 0,
                    scale: 0.8,
                    y: 60,
                    duration: 0.8,
                    delay: i * 0.15,
                    ease: "back.out(1.7)",
                });
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-base-100 py-20 px-2 sm:px-10 lg:px-20 flex flex-col items-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-10 text-center">Наша миссия</h2>
            <div className="flex flex-wrap gap-6 justify-center max-w-5xl mb-10 w-full">
                {squares.map((sq, idx) => (
                    <div
                        key={idx}
                        className="mission-square bg-base-200 rounded-xl shadow-lg p-6 sm:p-8 w-full sm:w-[260px] md:w-[260px] flex flex-col items-center justify-center text-center"
                        style={{ minHeight: "100px" }}
                    >
                        <div className="font-semibold text-lg mb-2">{sq.title}</div>
                        <div className="text-base text-base-content/80">{sq.text}</div>
                    </div>
                ))}
            </div>
            <div className="max-w-3xl mx-auto text-center text-base sm:text-lg text-base-content/80 leading-relaxed">
                Мы верим, что открытая обратная связь формирует доверие и помогает выбирать лучших специалистов.
            </div>
        </section>
    );
};