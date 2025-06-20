export const validateStep = (step: 1 | 2 | 3, formData: Record<string, string>, accountType: string | null): boolean => {
    if (step === 1) {
        return !!formData.name && !!formData.email && !!formData.phone;
    }
    if (step === 2) {
        const base = !!formData.username && !!formData.password;
        if (accountType === 'specialist') return base && !!formData.experienceYears && !!formData.about;
        if (accountType === 'organization') return base && !!formData.website && !!formData.address && !!formData.about;
        return base;
    }
    return true;
};