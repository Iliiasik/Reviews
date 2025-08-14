import { refreshToken } from './refreshToken';

let refreshTimerId: ReturnType<typeof setTimeout> | null = null;
const LOCAL_STORAGE_KEY = 'token_expiration';

export async function initTokenRefresh() {
    const expiresAtStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    const now = Date.now();

    if (expiresAtStr) {
        const expiresAt = parseInt(expiresAtStr, 10);
        const timeLeft = expiresAt - now;

        if (timeLeft > 15000) {
            scheduleTokenRefresh(Math.ceil(timeLeft / 1000));
            return true;
        }
    }

    try {
        const res = await refreshToken();
        const newExpiresAt = now + res.expires_in * 1000;
        localStorage.setItem(LOCAL_STORAGE_KEY, newExpiresAt.toString());
        scheduleTokenRefresh(res.expires_in);
        return true;
    } catch {
        cancelTokenRefresh();
        return false;
    }
}

export function scheduleTokenRefresh(expiresInSec: number) {
    if (refreshTimerId) clearTimeout(refreshTimerId);

    const refreshTime = Math.max(0, (expiresInSec - 15) * 1000);
    refreshTimerId = setTimeout(async () => {
        try {
            const res = await refreshToken();
            const newExpiresAt = Date.now() + res.expires_in * 1000;
            localStorage.setItem(LOCAL_STORAGE_KEY, newExpiresAt.toString());
            scheduleTokenRefresh(res.expires_in);
        } catch {
            cancelTokenRefresh();
        }
    }, refreshTime);
}

export function cancelTokenRefresh() {
    if (refreshTimerId) {
        clearTimeout(refreshTimerId);
        refreshTimerId = null;
    }
}
