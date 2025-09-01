import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const ContactsInfo = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".contacts-card", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-base-200 py-12 px-6 sm:px-10 lg:px-20 text-center">
            <h2 className="text-2xl font-bold mb-6">Наши контакты</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <div className="contacts-card bg-base-100 rounded-xl shadow p-6 w-full sm:w-72">
                    <p className="text-base-content/70 mb-2">Телефон для клиентов</p>
                    <p className="text-xl font-semibold">+996 (123) 00-00-00</p>
                </div>
                <div className="contacts-card bg-base-100 rounded-xl shadow p-6 w-full sm:w-72">
                    <p className="text-base-content/70 mb-2">Телефон для партнёров</p>
                    <p className="text-xl font-semibold">+996 (123) 00-00-00</p>
                </div>
            </div>
        </section>
    );
};
