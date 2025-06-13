import React, { useState, useRef } from 'react';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const userSvg = `
<svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <circle cx="12" cy="7" r="4" />
  <path d="M5.5 21c.5-4.5 4.5-7 6.5-7s6 2.5 6.5 7" />
</svg>
`;

const phoneSvg = `
<svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <rect x="7" y="2" width="10" height="20" rx="2" />
  <path d="M11 18h2" />
</svg>
`;

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [accountType, setAccountType] = useState<'user' | 'specialist' | 'organization' | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const leftSvgRef = useRef<HTMLDivElement>(null);
    const rightSvgRef = useRef<HTMLDivElement>(null);

    const animateSides = (type: 'user' | 'specialist' | 'organization' | null) => {
        const left = leftSvgRef.current;
        const right = rightSvgRef.current;
        if (!left || !right) return;

        if (type === 'user') {
            left.innerHTML = userSvg;
            right.innerHTML = phoneSvg;
        }

        gsap.fromTo(left, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 });
        gsap.fromTo(right, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 });
    };

    const handleAccountTypeSelect = (type: 'user' | 'specialist' | 'organization') => {
        setAccountType(type);
        setStep(2);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/profile');
    };

    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content relative overflow-hidden">
            <Navbar />
            <div ref={leftSvgRef} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div ref={rightSvgRef} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"></div>

            <main className="flex-grow flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-md shadow-lg rounded-box bg-base-200 p-8 relative">
                    <h1 className="text-3xl font-bold mb-6 text-center">Регистрация</h1>

                    {step === 1 && (
                        <div className="space-y-4">
                            <p className="text-center mb-4">Выберите тип аккаунта:</p>
                            <button className="btn w-full" onMouseEnter={() => animateSides('user')} onClick={() => handleAccountTypeSelect('user')}>
                                Пользователь
                            </button>
                            <button className="btn w-full" onMouseEnter={() => animateSides('specialist')} onClick={() => handleAccountTypeSelect('specialist')}>
                                Специалист
                            </button>
                            <button className="btn w-full" onMouseEnter={() => animateSides('organization')} onClick={() => handleAccountTypeSelect('organization')}>
                                Организация
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <label className="form-control w-full">
                                <div className="label m-2">
                                    <span className="label-text">Логин</span>
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Введите логин"
                                    className="input input-bordered w-full"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="form-control w-full">
                                <div className="label m-2">
                                    <span className="label-text">Пароль</span>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Введите пароль"
                                    className="input input-bordered w-full"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <button type="submit" className="btn btn-primary w-full mt-4">
                                Зарегистрироваться
                            </button>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Register;
