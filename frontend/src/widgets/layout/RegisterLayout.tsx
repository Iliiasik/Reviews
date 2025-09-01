import Navbar from '@shared/ui/Navbar';
import Footer from '@shared/ui/Footer';

interface RegisterLayoutProps {
    title?: string;
    children: React.ReactNode;
}

export const RegisterLayout = ({ title, children }: RegisterLayoutProps) => {
    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-center px-4 mt-24 pb-8">
                {title && (
                    <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>
                )}
                {children}
            </main>

            <Footer />
        </div>
    );
};
