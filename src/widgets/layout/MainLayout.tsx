import Navbar  from '@shared/ui/Navbar';
import Footer  from '@shared/ui/Footer';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen mt-24">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
};