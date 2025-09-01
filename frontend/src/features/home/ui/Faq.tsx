import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import clsx from 'clsx';

gsap.registerPlugin(TextPlugin);

const faqData = [
    { question: 'Как оставить отзыв на специалиста или учреждение?', answer: 'Выберите профиль врача или медицинского учреждения и нажмите кнопку "Оставить отзыв". Заполните форму и отправьте ваш отзыв.' },
    { question: 'Можно ли найти отзывы по определённой теме или подборке?', answer: 'Да, в системе есть удобный поиск и фильтры, позволяющие быстро находить отзывы по нужным критериям и подборкам.' },
    { question: 'Могу ли я редактировать или удалять свой отзыв?', answer: 'Вы можете редактировать или удалить свой отзыв в личном кабинете в любое время после публикации.' },
    { question: 'Как обеспечивается анонимность отзывов?', answer: 'Отзывы можно оставлять анонимно — система не раскрывает вашу личную информацию без вашего согласия.' },
    { question: 'Как быстро появляются новые отзывы в системе?', answer: 'Отзывы становятся доступны сразу после публикации.' },
];

const FaqItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void; }> = ({ question, answer, isOpen, onClick }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!contentRef.current || !wrapperRef.current) return;

        const content = contentRef.current;
        const wrapper = wrapperRef.current;

        gsap.killTweensOf(wrapper);

        if (isOpen) {
            gsap.fromTo(wrapper, { height: 0 }, {
                height: content.offsetHeight,
                duration: 0.4,
                ease: 'power2.out',
                onComplete: () => { wrapper.style.height = 'auto'; },
            });
        } else {
            gsap.to(wrapper, { height: 0, duration: 0.3, ease: 'power2.inOut' });
        }
    }, [isOpen]);

    return (
        <div className="border border-base-300 rounded-lg w-full">
            <button
                className="w-full px-4 py-3 text-left flex justify-between items-center text-lg font-semibold"
                onClick={onClick}
            >
                {question}
                <span className={clsx('transition-transform duration-300', isOpen && 'rotate-180')}>▼</span>
            </button>
            <div ref={wrapperRef} style={{ height: 0, overflow: 'hidden' }} className="px-4 text-base-content text-opacity-90">
                <div ref={contentRef} className="py-3">
                    <p>{answer}</p>
                </div>
            </div>
        </div>
    );
};

const Faq: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="p-6 sm:p-10 max-w-4xl mx-auto w-full">
            <h2 className="text-3xl font-bold text-center mb-10">Часто задаваемые вопросы</h2>
            <div className="space-y-6 w-full">
                {faqData.map((faq, idx) => (
                    <FaqItem
                        key={idx}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndex === idx}
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    />
                ))}
            </div>
        </section>
    );
};

const useDigitRoller = (
    containerRef: React.RefObject<HTMLDivElement | null>,
    target: string,
    delay: number
) => {
    useEffect(() => {
        if (!containerRef.current) return;

        const cleanDigits = target.replace(/\D/g, '');

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;

            const spans = Array.from(containerRef.current!.querySelectorAll('span'));
            let digitIndex = 0;

            spans.forEach((span, i) => {
                if (!/\d/.test(span.textContent || '')) return;
                const finalDigit = cleanDigits[digitIndex++];
                const timeline = gsap.timeline({ delay: delay + i * 0.1 });

                for (let j = 0; j < 5; j++) {
                    const random = Math.floor(Math.random() * 10).toString();
                    timeline.to(span, {
                        textContent: random,
                        duration: 0.05,
                        ease: 'none',
                        snap: { textContent: 1 },
                    });
                }

                timeline.to(span, {
                    textContent: finalDigit,
                    duration: 0.3,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                });
            });

            observer.disconnect();
        }, { threshold: 0.6 });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [containerRef, target, delay]);
};

const DigitBlock: React.FC<{ value: string; label: string; delay: number }> = ({ value, label, delay }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const formatted = [...value];
    useDigitRoller(containerRef, value, delay);

    return (
        <div className="text-center">
            <div ref={containerRef} className="text-3xl font-bold flex justify-center gap-0.5">
                {formatted.map((char, i) => (
                    /\d/.test(char) ? (
                        <span key={i} className="inline-block w-[0.6em] text-center">0</span>
                    ) : (
                        <span key={i} className="inline-block w-[0.6em] text-center">{char}</span>
                    )
                ))}
            </div>
            <div className="text-sm text-opacity-70">{label}</div>
        </div>
    );
};

const LeftContent: React.FC = () => {
    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-semibold">Оставляйте отзывы и помогайте другим</h3>
            <p className="text-base-content text-opacity-80">
                Делитесь опытом о специалистах и медицинских учреждениях. Ваш отзыв поможет людям сделать правильный выбор.
            </p>
            <button className="btn btn-primary w-full">Оставить отзыв</button>
            <div className="divider"></div>
            <div className="grid grid-cols-3 gap-4">
                <DigitBlock value="1,245" label="Отзывы" delay={0} />
                <DigitBlock value="215" label="Специалистов" delay={0.2} />
                <DigitBlock value="5,300" label="Пользователей" delay={0.4} />
            </div>
        </div>
    );
};

const MainComponent: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row w-full gap-4 p-6 items-start">
            <div className="card rounded-box grow p-6 bg-base-200 md:max-w-md">
                <LeftContent />
            </div>
            <div className="divider md:divider-horizontal"></div>
            <div className="card rounded-box p-6 bg-base-200 md:flex-1 min-w-0">
                <Faq />
            </div>
        </div>
    );
};

export default MainComponent;
