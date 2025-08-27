import { useState, useEffect, useCallback } from 'react';
import { resendConfirmationEmail } from '../api/resendEmail';

export const useResendConfirmation = (username: string) => {
    const [cooldown, setCooldown] = useState(0);
    const [resending, setResending] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const resend = useCallback(async () => {
        if (!username) return;

        setResending(true);
        setSuccess(false);

        try {
            await resendConfirmationEmail(username);
            setSuccess(true);
            setCooldown(60);
        } catch (e) {
            console.error('Ошибка при повторной отправке письма', e);
        } finally {
            setResending(false);
        }
    }, [username]);

    return { cooldown, resending, success, resend };
};
