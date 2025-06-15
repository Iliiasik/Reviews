import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@components/general/Navbar';
import Footer from '@components/general/Footer';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import StepSelectType from '@components/Register/SelectType';
import StepForm from '@components/Register/StepForm';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [accountType, setAccountType] = useState<'user' | 'specialist' | 'organization' | null>(null);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [formData, setFormData] = useState({ username: '', password: '', name: '', email: '', phone: '', experienceYears: '', about: '', website: '', address: '' });

    const leftSvgRef = useRef<HTMLDivElement>(null);
    const rightSvgRef = useRef<HTMLDivElement>(null);

    const animateSides = (type: 'user' | 'specialist' | 'organization' | null) => {
        const left = leftSvgRef.current;
        const right = rightSvgRef.current;
        if (!left || !right) return;

        const content = { user: ['🧑', '📱'], specialist: ['💼', '🩺'], organization: ['🏢', '📊'] }[type ?? 'user'];

        gsap.fromTo(left, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 });
        gsap.fromTo(right, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 });

        left.innerHTML = `<div class='text-6xl'>${content[0]}</div>`;
        right.innerHTML = `<div class='text-6xl'>${content[1]}</div>`;
    };

    const handleAccountTypeSelect = (type: 'user' | 'specialist' | 'organization') => {
        setAccountType(type);
        setStep(2);
        if (leftSvgRef.current) leftSvgRef.current.innerHTML = '';
        if (rightSvgRef.current) rightSvgRef.current.innerHTML = '';
    };
    const handleBackToType = () => {
        setStep(1);
        setAccountType(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...formData, account_type: accountType, experience_years: parseInt(formData.experienceYears) || undefined };

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) {
                setAlert({ type: 'error', message: data.error || 'Ошибка регистрации' });
                return;
            }

            setAlert({ type: 'success', message: data.message || 'Регистрация прошла успешно' });
            setTimeout(() => navigate('/profile'), 1500);
        } catch {
            setAlert({ type: 'error', message: 'Ошибка запроса к серверу' });
        }
    };

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content relative overflow-hidden">
            <Navbar />
            <div ref={leftSvgRef} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <div ref={rightSvgRef} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <main className="flex-grow flex flex-col items-center justify-center px-4 mt-24">
                <div className="w-full max-w-md shadow-lg rounded-box bg-base-200 p-8 relative">
                    <h1 className="text-3xl font-bold mb-6 text-center">Регистрация</h1>
                    {step === 1 && <StepSelectType onSelect={handleAccountTypeSelect} onHover={animateSides} />}
                    {step === 2 && (
                        <StepForm
                            accountType={accountType}
                            formData={formData}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            alert={alert}
                            onBack={handleBackToType}
                        />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Register;
