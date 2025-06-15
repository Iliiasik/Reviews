import React, {useState, useRef, useEffect} from 'react';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [accountType, setAccountType] = useState<'user' | 'specialist' | 'organization' | null>(null);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

    const leftSvgRef = useRef<HTMLDivElement>(null);
    const rightSvgRef = useRef<HTMLDivElement>(null);

    const animateSides = (type: 'user' | 'specialist' | 'organization' | null) => {
        const left = leftSvgRef.current;
        const right = rightSvgRef.current;
        if (!left || !right) return;

        const content = {
            user: ['🧑', '📱'],
            specialist: ['💼', '🩺'],
            organization: ['🏢', '📊']
        }[type ?? 'user'];

        gsap.fromTo(left, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 });
        gsap.fromTo(right, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 });

        left.innerHTML = `<div class='text-6xl'>${content[0]}</div>`;
        right.innerHTML = `<div class='text-6xl'>${content[1]}</div>`;
    };
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [alert]);


    const handleAccountTypeSelect = (type: 'user' | 'specialist' | 'organization') => {
        setAccountType(type);
        setStep(2);
        if (leftSvgRef.current) leftSvgRef.current.innerHTML = '';
        if (rightSvgRef.current) rightSvgRef.current.innerHTML = '';
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
        } catch (err) {
            console.error(err);
            setAlert({ type: 'error', message: 'Ошибка запроса к серверу' });
        }

    };



    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content relative overflow-hidden">
            <Navbar />
            <div ref={leftSvgRef} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div ref={rightSvgRef} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"></div>

            <main className="flex-grow flex flex-col items-center justify-center px-4 mt-24">
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
                            <Input name="name" label="Имя" value={formData.name} onChange={handleChange} />
                            <Input name="email" label="Email" value={formData.email} onChange={handleChange} />
                            <Input name="phone" label="Телефон" value={formData.phone} onChange={handleChange} />
                            <Input name="username" label="Логин" value={formData.username} onChange={handleChange} />
                            <Input name="password" type="password" label="Пароль" value={formData.password} onChange={handleChange} />

                            {accountType === 'specialist' && (
                                <>
                                    <Input name="experienceYears" type="number" label="Опыт (в годах)" value={formData.experienceYears} onChange={handleChange} />
                                    <Textarea name="about" label="О себе" value={formData.about} onChange={handleChange} />
                                </>
                            )}

                            {accountType === 'organization' && (
                                <>
                                    <Input name="website" label="Сайт" value={formData.website} onChange={handleChange} />
                                    <Input name="address" label="Адрес" value={formData.address} onChange={handleChange} />
                                    <Textarea name="about" label="О нас" value={formData.about} onChange={handleChange} />
                                </>
                            )}
                            {alert && (
                                <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'} shadow-lg`}>
                                    <span>{alert.message}</span>
                                </div>
                            )}

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

// Переиспользуемые поля
const Input = ({ name, label, value, onChange, type = 'text' }: any) => (
    <label className="form-control w-full">
        <div className="label m-2">
            <span className="label-text">{label}</span>
        </div>
        <input
            type={type}
            name={name}
            className="input input-bordered w-full"
            value={value}
            onChange={onChange}
            required
        />
    </label>
);

const Textarea = ({ name, label, value, onChange }: any) => (
    <label className="form-control w-full">
        <div className="label m-2">
            <span className="label-text">{label}</span>
        </div>
        <textarea
            name={name}
            className="textarea textarea-bordered w-full"
            value={value}
            onChange={onChange}
            required
        />
    </label>
);

export default Register;
