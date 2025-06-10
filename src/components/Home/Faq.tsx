import React from 'react';

const Faq: React.FC = () => {
    return (
        <section className="p-8 w-full max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Частые вопросы</h2>
            <ul className="timeline timeline-vertical text-lg">
                <li>
                    <div className="timeline-start timeline-box font-semibold">Как записаться к врачу?</div>
                    <div className="timeline-middle">
                        <div className="badge badge-primary badge-xl text-xl">❓</div>
                    </div>
                    <hr />
                </li>
                <li>
                    <hr />
                    <div className="timeline-middle">
                        <div className="badge badge-primary badge-xl text-xl">📅</div>
                    </div>
                    <div className="timeline-end timeline-box">Выберите врача, нажмите «Записаться» и выберите время.</div>
                    <hr />
                </li>
                <li>
                    <hr />
                    <div className="timeline-start timeline-box font-semibold">Это бесплатно?</div>
                    <div className="timeline-middle">
                        <div className="badge badge-primary badge-xl text-xl">💸</div>
                    </div>
                    <hr />
                </li>
                <li>
                    <hr />
                    <div className="timeline-middle ">
                        <div className="badge badge-primary badge-xl text-xl">✅</div>
                    </div>
                    <div className="timeline-end timeline-box">Да, сервис бесплатен. Вы платите только за приём.</div>
                    <hr />
                </li>
                <li>
                    <hr />
                    <div className="timeline-start timeline-box font-semibold">Можно ли отменить запись?</div>
                    <div className="timeline-middle">
                        <div className="badge badge-primary badge-xl text-xl">⏰</div>
                    </div>
                    <hr />
                </li>
                <li>
                    <hr />
                    <div className="timeline-middle">
                        <div className="badge badge-primary badge-xl text-xl">🔁</div>
                    </div>
                    <div className="timeline-end timeline-box">Да, вы можете отменить или перенести приём в профиле.</div>

                </li>
            </ul>


        </section>

    );
};

export default Faq;
