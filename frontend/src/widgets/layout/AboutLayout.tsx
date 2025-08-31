import Navbar from '@shared/ui/Navbar';
import Footer from '@shared/ui/Footer';

export const AboutLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col min-h-screen mt-24">
        <Navbar />
        {children}
        <Footer />
    </div>
);