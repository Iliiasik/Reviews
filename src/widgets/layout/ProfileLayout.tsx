import Navbar from '@shared/ui/Navbar';
import Footer from '@shared/ui/Footer';

export const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
            <Navbar />
            <main className="flex-grow pt-20 pb-12 px-4 md:px-6">
                {children}
            </main>
            <Footer />
        </div>
    );
};