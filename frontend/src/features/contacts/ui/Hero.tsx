import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export const Hero = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".contacts-title", { y: -40, opacity: 0, duration: 0.9, ease: "power4.out" });
            gsap.from(".contacts-description", { y: 18, opacity: 0, duration: 0.9, delay: 0.25, ease: "power2.out" });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={sectionRef}
            className="bg-base-200/80 backdrop-blur rounded-2xl shadow-2xl w-72 sm:w-80 aspect-square p-6 sm:p-8 flex items-center justify-center text-center"
        >
            <div>
                <h1 className="contacts-title text-3xl sm:text-4xl font-extrabold mb-3">
                    Свяжитесь с нами
                </h1>
                <p className="contacts-description text-base sm:text-lg text-base-content/80">
                    Есть вопросы, предложения или хотите сотрудничать? Заполните форму — мы ответим как можно скорее.
                </p>
            </div>
        </div>
    );
};
