import type { ChangeEvent } from 'react';

export type AccountType = 'user' | 'specialist' | 'organization';

export interface StepFormData {
    name: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    confirmPassword: string;
    experienceYears: number;
    about?: string;
    website?: string;
    address?: string;
}

export interface StepComponentProps {
    formData: StepFormData;
    accountType: AccountType | null;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    errors: Record<string, string>;
    onNext?: () => void;
    onBack?: () => void;
    onSubmit?: (e?: React.FormEvent) => void;
    loading?: boolean;
}