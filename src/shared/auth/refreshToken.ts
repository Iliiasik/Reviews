import api from '../axios/axios';

export async function refreshToken() {
    const res = await api.post<{ expires_in: number }>('/auth/refresh');
    return res.data;
}
