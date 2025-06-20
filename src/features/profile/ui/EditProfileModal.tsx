import { useState, useEffect } from 'react';
import {updateProfile} from "@features/profile/api/profile.ts";

interface EditProfileModalProps {
    profile: any;
    onClose: () => void;
    onSuccess: () => void;
}

export const EditProfileModal = ({ profile, onClose, onSuccess }: EditProfileModalProps) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        about: '',
        website: '',
        address: '',
        experience_years: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm({
            name: profile?.name ?? '',
            email: profile?.email ?? '',
            phone: profile?.phone ?? '',
            about: profile?.about ?? '',
            website: profile?.website ?? '',
            address: profile?.address ?? '',
            experience_years: profile?.experience_years?.toString() ?? '',
        });
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const payload = {
            name: form.name,
            email: form.email,
            phone: form.phone,
            about: form.about,
            website: profile.role === 'organization' ? form.website : undefined,
            address: profile.role === 'organization' ? form.address : undefined,
            experience_years: profile.role === 'specialist' ? parseInt(form.experience_years || '0') : undefined,
        };

        try {
            await updateProfile(payload);
            onSuccess();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Ошибка при сохранении');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg w-full max-w-md shadow-lg">
                <h3 className="text-xl font-bold mb-4">Редактирование профиля</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Имя / Название" className="input input-bordered w-full" required />
                    <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input input-bordered w-full" type="email" required />
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Телефон" className="input input-bordered w-full" />

                    {(profile.role === 'specialist' || profile.role === 'organization') && (
                        <textarea name="about" value={form.about} onChange={handleChange} placeholder="О себе / О нас" className="textarea textarea-bordered w-full" />
                    )}

                    {profile.role === 'organization' && (
                        <>
                            <input name="website" value={form.website} onChange={handleChange} placeholder="Сайт" className="input input-bordered w-full" />
                            <input name="address" value={form.address} onChange={handleChange} placeholder="Адрес" className="input input-bordered w-full" />
                        </>
                    )}

                    {profile.role === 'specialist' && (
                        <input name="experience_years" value={form.experience_years} onChange={handleChange} placeholder="Опыт (лет)" type="number" className="input input-bordered w-full" />
                    )}

                    {error && <div className="text-error text-sm">{error}</div>}

                    <div className="flex justify-end gap-4">
                        <button type="button" className="btn" onClick={onClose}>Отмена</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Сохраняем...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};