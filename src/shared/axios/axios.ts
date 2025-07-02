import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axios.post('/auth/refresh', null, { withCredentials: true });
                processQueue(null);
                return api(originalRequest); // повтор запроса
            } catch (err) {
                processQueue(err, null);
                window.location.href = '/login'; // или setUser(null)
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);

export default api;
