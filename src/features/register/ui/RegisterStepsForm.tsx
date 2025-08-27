import { AnimatePresence, motion } from 'framer-motion';
import { BaseInfoStep } from './BaseInfoStep.tsx';
import { AdditionalInfoStep } from './AdditionalInfoStep.tsx';
import { StepsMockup } from './StepsMockup';
import type { StepFormData } from '@features/register/types/StepForm';
import { useState } from 'react';

interface StepFormProps {
    accountType: 'user' | 'specialist' | 'organization' | null;
    formData: StepFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
    error?: string;
    loading?: boolean;
    errors: Record<string, string>;
    validateStep1: () => Promise<boolean>;
}

export const RegisterStepsForm: React.FC<StepFormProps> = ({
                                                               accountType,
                                                               formData,
                                                               handleChange,
                                                               handleSubmit,
                                                               onBack,
                                                               error,
                                                               loading,
                                                               errors,
                                                               validateStep1,
                                                           }) => {
    const [formStep, setFormStep] = useState<1 | 2>(1);
    const progressValue = formStep === 1 ? 50 : 100;

    const handleNext = async () => {
        const isValid = await validateStep1();
        if (isValid) {
            setFormStep(2);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row lg:divide-x-2 divide-base-content/30 gap-8">
            <div className="w-full lg:w-1/2">
                <div className="flex items-center mb-4">
                    <button
                        type="button"
                        onClick={formStep === 1 ? onBack : () => setFormStep(1)}
                        className="btn btn-ghost btn-sm p-2"
                        aria-label="Назад"
                        disabled={loading}
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

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={formStep}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.15, ease: 'easeInOut' }}
                            className="space-y-4"
                        >
                            {formStep === 1 ? (
                                <BaseInfoStep
                                    formData={formData}
                                    handleChange={handleChange}
                                    errors={errors}
                                    onNext={handleNext}
                                />
                            ) : (
                                <AdditionalInfoStep
                                    formData={formData}
                                    accountType={accountType}
                                    handleChange={handleChange}
                                    errors={errors}
                                    onBack={() => setFormStep(1)}
                                    onSubmit={(e) => {
                                        if (e) e.preventDefault();
                                        handleSubmit(e || { preventDefault: () => {} } as React.FormEvent);
                                    }}
                                    loading={loading}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <motion.div
                        className="w-full h-1 bg-base-200 rounded-full overflow-hidden mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: `${(formStep-1)*50}%` }}
                            animate={{ width: `${progressValue}%` }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        />
                    </motion.div>

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