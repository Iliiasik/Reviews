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
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-base-100/70 backdrop-blur-md p-6 rounded-2xl w-full max-w-md shadow-xl border border-base-200 border-opacity-40">
                <h3 className="text-xl font-bold mb-4">Редактирование профиля</h3>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Имя / Название</span>
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="input input-bordered w-full opacity-75"
                            placeholder="Имя / Название"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Email</span>
                        </label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            type="email"
                            className="input input-bordered w-full opacity-75 "
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Телефон</span>
                        </label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="input input-bordered w-full opacity-75 "
                            placeholder="Телефон"
                        />
                    </div>

                    {(profile.role === 'specialist' || profile.role === 'organization') && (
                        <div className="form-control">
                            <label className="label">
            <span className="label-text font-semibold">
              {profile.role === 'specialist' ? 'О себе' : 'О нас'}
            </span>
                            </label>
                            <textarea
                                name="about"
                                value={form.about}
                                onChange={handleChange}
                                className="textarea textarea-bordered w-full opacity-75"
                                placeholder={profile.role === 'specialist' ? 'О себе' : 'О нас'}
                            />
                        </div>
                    )}

                    {profile.role === 'organization' && (
                        <>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Сайт</span>
                                </label>
                                <input
                                    name="website"
                                    value={form.website}
                                    onChange={handleChange}
                                    className="input input-bordered w-full opacity-75 "
                                    placeholder="Сайт"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Адрес</span>
                                </label>
                                <input
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    className="input input-bordered w-full opacity-75 "
                                    placeholder="Адрес"
                                />
                            </div>
                        </>
                    )}

                    {profile.role === 'specialist' && (
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Опыт (лет)</span>
                            </label>
                            <input
                                name="experience_years"
                                value={form.experience_years}
                                onChange={handleChange}
                                type="number"
                                className="input input-bordered w-full opacity-75 "
                                placeholder="Опыт (лет)"
                            />
                        </div>
                    )}

                    {error && <div className="text-error text-sm">{error}</div>}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            className="btn btn-ghost bg-opacity-5 hover:bg-opacity-10"
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="btn bg-opacity-10 hover:bg-opacity-20"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
              <span className="loading loading-spinner loading-sm"></span>
              Сохраняем...
            </span>
                            ) : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};