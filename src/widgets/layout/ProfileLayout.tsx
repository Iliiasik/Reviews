import Navbar from '@shared/ui/Navbar';
import Footer from '@shared/ui/Footer';
import Toast from '@shared/ui/Toast';
import { useToast } from '@features/profile/model/useToast';

export const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
    const { toast, hideToast } = useToast();

    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
            <Navbar />
            <main className="flex-grow pt-20 pb-12 px-4 md:px-6">
                {children}
            </main>
            <Footer />

            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={3000}
                    onClose={hideToast}
                />
            )}
        </div>
    );
};