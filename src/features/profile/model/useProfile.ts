import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchProfile } from '../api/profile';
import { useToast } from '@features/profile/model/useToast';

export const useProfile = () => {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const hasFetchedProfile = useRef(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();

    useEffect(() => {
        if (hasFetchedProfile.current) return;

        const loadProfile = async () => {
            try {
                const data = await fetchProfile();
                setProfile(data);
                hasFetchedProfile.current = true;

                if (location.state?.loginSuccess) {
                    showToast('Успешный вход!', 'success');
                } else if (location.state?.alreadyLoggedIn) {
                    showToast('Вы уже вошли в систему', 'info');
                }

                navigate(location.pathname, { replace: true, state: {} });
            } catch (error) {
                console.error("Ошибка загрузки профиля:", error);
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [location, navigate, showToast]);

    const handleProfileUpdate = async () => {
        try {
            const data = await fetchProfile();
            setProfile(data);
            showToast('Профиль успешно обновлён', 'success');
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
        }
    };

    return {
        profile,
        isLoading,
        handleProfileUpdate,
    };
};