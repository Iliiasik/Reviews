import api from '@shared/axios/axios';

export const createUnverifiedProfile = async (data: {
    name: string;
    about: string;
    type: 'specialist' | 'organization';
}) => {
    return api.post('/unverified-profile', data);
};
