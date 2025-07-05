import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

// let isRefreshing = false;
// let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void }[] = [];
//
// const processQueue = (error: any, token: string | null = null) => {
//     failedQueue.forEach(({ resolve, reject }) => {
//         if (error) {
//             reject(error);
//         } else {
//             resolve(token);
//         }
//     });
//     failedQueue = [];
// };

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('Attempting token refresh...');

            try {
                const response = await axios.post('/api/auth/refresh', null, {
                    withCredentials: true
                });
                console.log('Refresh successful', response.data);
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Refresh failed', refreshError);
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
