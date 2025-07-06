import { useState, useEffect } from 'react';
import { useToast } from '@shared/context/ToastContext';
import { VerificationRequestsApi } from '../api/verification_requests';
import { useProfile } from './useProfile';

export const useVerificationRequests = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const { profile } = useProfile();

    const fetchRequests = async () => {
        if (profile?.role !== 'admin') {
            setRequests([]);
            return;
        }

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

    const approveRequest = async (id: number) => {
        try {
            await VerificationRequestsApi.approve(id);
            showToast('Заявка подтверждена', 'success');
            setRequests(prev => prev.filter(req => req.id !== id));
        } catch (error) {
            console.error('Ошибка подтверждения:', error);
            showToast('Ошибка подтверждения', 'error');
        }
    };

    const rejectRequest = async (id: number) => {
        try {
            await VerificationRequestsApi.reject(id);
            showToast('Заявка отклонена', 'success');
            setRequests(prev => prev.filter(req => req.id !== id));
        } catch (error) {
            console.error('Ошибка отклонения:', error);
            showToast('Ошибка отклонения', 'error');
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [profile?.role]);

    return {
        requests,
        loading,
        approveRequest,
        rejectRequest,
        refreshRequests: fetchRequests
    };
};