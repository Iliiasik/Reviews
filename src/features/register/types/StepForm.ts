import type {ChangeEvent} from 'react';

export type AccountType = 'user' | 'specialist' | 'organization';

export interface StepFormData {
    name: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    experienceYears?: string;
    about?: string;
    website?: string;
    address?: string;
    avatar?: File | null;
}

export interface StepComponentProps {
    formData: StepFormData;
    accountType: AccountType | null;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onNext?: () => void;
    onBack?: () => void;
}
