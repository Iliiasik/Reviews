import { useState, useEffect } from 'react';
import { useToast } from '@shared/context/ToastContext';
import { VerificationRequestsApi } from '../api/verification_requests';
import { useProfile } from './useProfile';
import type {VerificationRequest} from '../types/verifications';

export const useVerificationRequests = () => {
    const [requests, setRequests] = useState<VerificationRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const { profile } = useProfile();

    const refreshRequests = async () => {
        try {
            setLoading(true);
            const data = await VerificationRequestsApi.getPending();
            setRequests(data);
        } catch (error) {
            console.error('Ошибка загрузки заявок:', error);
            showToast('Ошибка загрузки заявок', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestResult = (id: number, successMsg: string) => {
        setRequests(prev => prev.filter(req => req.id !== id));
        showToast(successMsg, 'success');
    };

    const approveRequest = async (id: number) => {
        try {
            await VerificationRequestsApi.approve(id);
            handleRequestResult(id, 'Заявка подтверждена');
        } catch (error) {
            console.error('Ошибка подтверждения:', error);
            showToast('Ошибка подтверждения', 'error');
        }
    };

    const rejectRequest = async (id: number) => {
        try {
            await VerificationRequestsApi.reject(id);
            handleRequestResult(id, 'Заявка отклонена');
        } catch (error) {
            console.error('Ошибка отклонения:', error);
            showToast('Ошибка отклонения', 'error');
        }
    };

    useEffect(() => {
        if (profile?.role === 'admin') {
            refreshRequests();
        } else {
            setRequests([]);
        }
    }, [profile?.role]);

    return {
        requests,
        loading,
        approveRequest,
        rejectRequest,
        refreshRequests,
    };
};