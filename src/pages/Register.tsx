import React, { useState, useEffect } from 'react';
import Navbar from '@shared/ui/Navbar';
import Footer from '@shared/ui/Footer';
import { useNavigate } from 'react-router-dom';
import StepSelectType from '@components/Register/SelectType';
import {Form} from '@components/Register/Form.tsx';
import { motion, AnimatePresence } from 'framer-motion';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [accountType, setAccountType] = useState<'user' | 'specialist' | 'organization' | null>(null);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [formStep, setFormStep] = useState<1 | 2 | 3>(1);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        phone: '',
        experienceYears: '',
        about: '',
        website: '',
        address: '',
    });

    const handleAccountTypeSelect = (type: 'user' | 'specialist' | 'organization') => {
        setAccountType(type);
        setStep(2);
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
        const payload = {
            ...formData,
            account_type: accountType,
            experience_years: parseInt(formData.experienceYears) || undefined,
        };

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
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-center px-4 mt-24">
                <h1 className="text-3xl font-bold mb-6 text-center">Регистрация</h1>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -30 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                                mass: 0.6,
                            }}
                            className="w-full max-w-4xl h-[500px] flex bg-base-200 shadow-lg rounded-box overflow-hidden"
                        >
                            <div className="hidden lg:flex w-1/2 bg-base-300 items-center justify-center">
                                <div className="text-center text-xl text-base-content/60 px-8">
                                    Выберите тип аккаунта, чтобы увидеть визуализацию
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 p-8 flex justify-center items-center">
                                <StepSelectType onSelect={handleAccountTypeSelect} />
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -30 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                                mass: 0.6,
                            }}
                            className="w-full max-w-2xl bg-base-200 shadow-lg rounded-box p-8"
                        >
                            <Form
                                accountType={accountType}
                                formData={formData}
                                handleChange={handleChange}
                                handleSubmit={handleSubmit}
                                onBack={handleBackToType}
                                formStep={formStep}
                                setFormStep={setFormStep}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>

            <Footer />
        </div>
    );
};

export default Register;
