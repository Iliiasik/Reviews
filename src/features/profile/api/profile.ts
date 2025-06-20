export const fetchProfile = async () => {
    const response = await fetch("/api/profile", { credentials: "include" });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch profile');
    }
    return response.json();
};

export const updateProfile = async (data: any) => {
    const response = await fetch('/api/profile/update', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
    }
    return response.json();
};