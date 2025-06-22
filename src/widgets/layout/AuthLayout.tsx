import Navbar  from '@shared/ui/Navbar';
import  Footer  from '@shared/ui/Footer';

export const AuthLayout = ({
                               children,
                               title
                           }: {
    children: React.ReactNode;
    title: string;
}) => {
    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
            <Navbar />
            <main className="flex-grow flex flex-col items-center justify-center px-4 mt-12">
                <div className="w-full max-w-md shadow-lg rounded-box bg-base-200 p-8">
                    <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};