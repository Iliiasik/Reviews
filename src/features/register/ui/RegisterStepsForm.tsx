// RegisterStepsForm.tsx
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { StepsMockup } from './StepsMockup';
import { useWarnToast } from '../lib/useWarnToast';
import { validateStep } from '../lib/useStepValidator';
import type { StepFormData } from '@features/register/types/StepForm';

interface StepFormProps {
    accountType: 'user' | 'specialist' | 'organization' | null;
    formData: StepFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
    formStep: 1 | 2 | 3;
    setFormStep: (step: 1 | 2 | 3) => void;
    error?: string;
    loading?: boolean;
    avatarPreview: string | null; //
    handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void; //
    setAvatarPreview: (value: string | null) => void; //
}

export const RegisterStepsForm: React.FC<StepFormProps> = ({
                                                               accountType,
                                                               formData,
                                                               handleChange,
                                                               handleSubmit,
                                                               onBack,
                                                               formStep,
                                                               setFormStep,
                                                               error,
                                                               loading,
                                                               avatarPreview,
                                                               handleAvatarChange,
                                                           }) => {
    const toast = useWarnToast();

    const handleNext = () => {
        if (!validateStep(formStep, formData, accountType)) {
            toast('Пожалуйста, заполните все поля на этом шаге.');
            return;
        }
        setFormStep((formStep + 1) as 1 | 2 | 3);
    };

    const handleBack = () => {
        setFormStep((formStep - 1) as 1 | 2 | 3);
    };

    const internalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(1, formData, accountType)) {
            setFormStep(1);
            toast('Пожалуйста, заполните все поля на шаге 1.');
            return;
        }
        if (!validateStep(2, formData, accountType)) {
            setFormStep(2);
            toast('Пожалуйста, заполните все поля на шаге 2.');
            return;
        }
        handleSubmit(e);
    };

    return (
        <div className="flex flex-col lg:flex-row lg:divide-x-2 divide-base-content/30 gap-8">
            <div className="w-full lg:w-1/2">
                <div className="flex items-center mb-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="btn btn-ghost btn-sm p-2"
                        aria-label="Назад к выбору"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 stroke-base-content"
                        >
                            <path
                                d="M15 6L9 12L15 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                <form className="space-y-4" onSubmit={internalSubmit}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={formStep}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.15, ease: 'easeInOut' }}
                            className="space-y-4"
                        >
                            {formStep === 1 && (
                                <Step1
                                    formData={formData}
                                    accountType={accountType}
                                    handleChange={handleChange}
                                    onNext={handleNext}
                                />
                            )}
                            {formStep === 2 && (
                                <Step2
                                    formData={formData}
                                    accountType={accountType}
                                    handleChange={handleChange}
                                    onNext={handleNext}
                                    onBack={handleBack}
                                />
                            )}
                            {formStep === 3 && (
                                <Step3
                                    avatarPreview={avatarPreview}
                                    handleAvatarChange={handleAvatarChange}
                                    onBack={handleBack}
                                    loading={loading}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {error && (
                        <div className="alert alert-error shadow-md mt-2 mb-3 max-w-md mx-auto py-1.5 px-3 rounded-md flex items-center gap-2 text-xs">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="stroke-current flex-shrink-0 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                                />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="w-full flex flex-col items-center mb-6">
                        <div className="w-full max-w-md h-1 bg-base-300 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${formStep === 1 ? 33 : formStep === 2 ? 66 : 100}%` }}
                            />
                        </div>
                    </div>
                </form>
            </div>

            <div className="hidden lg:block w-1/2">
                <StepsMockup
                    formStep={formStep}
                    formData={formData}
                    accountType={accountType}
                />
            </div>
        </div>
    );
};
