import { Outlet } from 'react-router-dom';
import Navbar from '@shared/ui/Navbar';
import Footer from '@shared/ui/Footer';

export const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen mt-24">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};
