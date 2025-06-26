import { useParams } from 'react-router-dom';

export const OrganizationProfile = () => {
    const { id } = useParams();


    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Профиль организации</h1>
            <p>Здесь будет информация об организации с ID: {id}</p>
        </div>
    );
};
