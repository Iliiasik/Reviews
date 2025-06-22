import { AnimatePresence, motion } from 'framer-motion';
import { RegisterTypeSelect } from './RegisterTypeSelect.tsx';
import { RegisterStepsForm } from './RegisterStepsForm.tsx';
import { useRegister } from '../model/useRegister.ts';
import  Toast  from '@shared/ui/Toast';

export const RegisterForm = () => {
    const {
        step,
        formStep,
        accountType,
        formData,
        error,
        loading,
        showToast,
        toastMessage,
        setShowToast,
        handleAccountTypeSelect,
        handleBackToType,
        handleChange,
        handleSubmit,
        setFormStep,
    } = useRegister();

    return (
        <>
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
                        className="w-full max-w-lg flex bg-base-200 shadow-lg rounded-box overflow-hidden"
                    >
                        <div className="hidden lg:flex w-1/2 bg-base-300 items-center justify-center">
                            <div className="text-center text-xl text-base-content/60 px-8">
                                Выберите тип аккаунта
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 p-8 flex justify-center items-center">
                            <RegisterTypeSelect onSelect={handleAccountTypeSelect} />
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
                        <RegisterStepsForm
                            accountType={accountType}
                            formData={formData}
                            formStep={formStep}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            onBack={handleBackToType}
                            setFormStep={setFormStep}
                            error={error}
                            loading={loading}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {showToast && (
                <Toast
                    message={toastMessage}
                    type="success"
                    duration={3000}
                    onClose={() => setShowToast(false)}
                />
            )}
        </>
    );
};