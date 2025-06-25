export const changePassword = async (data: {
    current_password: string;
    new_password: string;
}) => {
    const response = await fetch('/api/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to change password');
    }
    return response.json();
};