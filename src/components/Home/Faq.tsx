import React from 'react';

const faqData = [
    {
        question: 'Как оставить отзыв на специалиста или учреждение?',
        answer:
            'Выберите профиль врача или медицинского учреждения и нажмите кнопку "Оставить отзыв". Заполните форму и отправьте ваш отзыв.',
    },
    {
        question: 'Можно ли найти отзывы по определённой теме или подборке?',
        answer:
            'Да, в системе есть удобный поиск и фильтры, позволяющие быстро находить отзывы по нужным критериям и подборкам.',
    },
    {
        question: 'Могу ли я редактировать или удалять свой отзыв?',
        answer:
            'Вы можете редактировать или удалить свой отзыв в личном кабинете в любое время после публикации.',
    },
    {
        question: 'Как обеспечивается анонимность отзывов?',
        answer:
            'Отзывы можно оставлять анонимно — система не раскрывает вашу личную информацию без вашего согласия.',
    },
    {
        question: 'Как быстро появляются новые отзывы в системе?',
        answer:
            'Отзывы проходят модерацию и обычно становятся доступными в течение нескольких часов после отправки.',
    },
];

const Faq: React.FC = () => {
    return (
        <section className="p-6 sm:p-10 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Часто задаваемые вопросы</h2>
            <div className="space-y-6">
                {faqData.map(({ question, answer }, idx) => (
                    <details
                        key={idx}
                        className="group border border-base-300 rounded-lg p-4"
                    >
                        <summary className="cursor-pointer text-lg font-semibold list-none flex justify-between items-center">
                            {question}
                            <span className="transition-transform duration-200 group-open:rotate-180 select-none">▼</span>
                        </summary>
                        <p className="mt-3 text-base-content text-opacity-90">{answer}</p>
                    </details>
                ))}
            </div>
        </section>
    );
};

const LeftContent: React.FC = () => (
    <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-semibold">Оставляйте отзывы и помогайте другим</h3>
        <p className="text-base-content text-opacity-80">
            Делитесь опытом о специалистах и медицинских учреждениях. Ваш отзыв поможет людям сделать правильный выбор.
        </p>
        <button className="btn btn-primary w-full">Оставить отзыв</button>

        <div className="divider"></div>

        <div className="grid grid-cols-3 gap-4 text-center">
            <div>
                <div className="text-3xl font-bold">1,245</div>
                <div className="text-sm text-opacity-70">Отзывы</div>
            </div>
            <div>
                <div className="text-3xl font-bold">215</div>
                <div className="text-sm text-opacity-70">Специалистов</div>
            </div>
            <div>
                <div className="text-3xl font-bold">5,300</div>
                <div className="text-sm text-opacity-70">Пользователей</div>
            </div>
        </div>
    </div>
);

const MainComponent: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row w-full gap-4 p-6 items-start">
            <div className="card rounded-box grow p-6 bg-base-200 md:max-w-md">
                <LeftContent />
            </div>

            <div className="divider md:divider-horizontal">OR</div>

            <div className="card rounded-box p-6 bg-base-200 md:flex-1 min-w-0">
                <Faq />
            </div>
        </div>
    );
};

export default MainComponent;
