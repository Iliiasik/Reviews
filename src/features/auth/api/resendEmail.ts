export const resendConfirmationEmail = async (username: string) => {
    const response = await fetch('/api/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });

    if (!response.ok) {
        throw new Error('Не удалось отправить письмо');
    }
};
