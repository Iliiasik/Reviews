import { useState } from 'react';

export type PasswordStrength = 'weak' | 'medium' | 'strong' | null;

export function usePasswordStrength() {
    const [strength, setStrength] = useState<PasswordStrength>(null);

    const evaluateStrength = (password: string) => {
        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const result: PasswordStrength =
            score <= 1 ? 'weak' : score <= 3 ? 'medium' : 'strong';

        setStrength(result);
        return result;
    };

    return { strength, evaluateStrength };
}
