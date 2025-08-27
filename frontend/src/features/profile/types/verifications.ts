export interface VerificationRequest {
    id: number;
    description: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
        avatar_url?: string | null;
        role: {
            name: string;
        };
    };
}