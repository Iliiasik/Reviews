import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useProfile } from '../model/useProfile';
import { useProfileActions } from '../model/useProfileActions';
import { useQrCode } from '../model/useQrCode';
import { useVerificationRequests } from '../model/useVerificationRequests';
import { useReviews } from '../model/useReviews';
import { ProfileHeader } from './ProfileHeader';
import { ProfileTab } from './ProfileTab';
import { ReviewsTab } from './ReviewsTab';
import { QrTab } from './QrTab';
import { VerificationsTab } from './VerificationsTab';
import { ChangePasswordModal } from '@features/profile/ui/ChangePasswordModal';
import { EditProfileModal } from './EditProfileModal';

export const ProfileContent = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const profileRef = useRef<HTMLDivElement>(null);
    const reviewsRef = useRef<HTMLDivElement>(null);
    const qrRef = useRef<HTMLDivElement>(null);
    const verificationsRef = useRef<HTMLDivElement>(null);

    const { profile, isLoading, handleProfileUpdate } = useProfile();
    const { handleLogout } = useProfileActions();
    const { qrUrl, generate, download } = useQrCode();
    const { requests, loading: verificationsLoading, approveRequest, rejectRequest } = useVerificationRequests();
    const {
        userReviews,
        summary,
        loading: reviewsLoading,
        pagination,
        filters,
        handlePageChange,
        handleFilterChange,
    } = useReviews();

    useEffect(() => {
        const refs = {
            profile: profileRef,
            reviews: reviewsRef,
            qr: qrRef,
            verifications: verificationsRef,
        };

        const currentRef = refs[activeTab as keyof typeof refs]?.current;
        if (!currentRef) return;

        const animationProps = {
            profile: { opacity: 0, y: 20 },
            reviews: { opacity: 0, x: -20 },
            qr: { opacity: 0, x: 20 },
            verifications: { opacity: 0, y: 20 },
        };

        gsap.from(currentRef, {
            ...animationProps[activeTab as keyof typeof animationProps],
            duration: 0.3,
            ease: "power2.out"
        });
    }, [activeTab]);

    const tabs = [
        { id: 'profile', label: 'Профиль' },
        { id: 'reviews', label: 'Отзывы' },
        ...(profile?.role === 'specialist' || profile?.role === 'organization'
            ? [{ id: 'qr', label: 'QR-код' }]
            : []),
        ...(profile?.role === 'admin'
            ? [{ id: 'verifications', label: 'Заявки' }]
            : []),
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <ProfileHeader
                profile={profile}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={tabs}
            />

            <div className="bg-base-200 rounded-lg shadow overflow-hidden">
                {activeTab === 'profile' && (
                    <ProfileTab
                        ref={profileRef}
                        profile={profile}
                        isLoading={isLoading}
                        onEdit={() => setShowEditModal(true)}
                        onChangePassword={() => setShowChangePasswordModal(true)}
                        onLogout={handleLogout}
                    />
                )}

                {activeTab === 'reviews' && (
                    <ReviewsTab
                        ref={reviewsRef}
                        profile={profile}
                        userReviews={userReviews}
                        summary={summary}
                        loading={reviewsLoading}
                        pagination={pagination}
                        filters={filters}
                        handlePageChange={handlePageChange}
                        handleFilterChange={handleFilterChange}
                    />
                )}

                {activeTab === 'qr' && (
                    <QrTab
                        ref={qrRef}
                        qrCode={qrUrl}
                        onGenerate={generate}
                        onDownload={download}
                    />
                )}

                {activeTab === 'verifications' && (
                    <VerificationsTab
                        ref={verificationsRef}
                        requests={requests}
                        loading={verificationsLoading}
                        onApprove={approveRequest}
                        onReject={rejectRequest}
                    />
                )}
            </div>

            {showChangePasswordModal && (
                <ChangePasswordModal
                    onClose={() => setShowChangePasswordModal(false)}
                    onSuccess={() => setShowChangePasswordModal(false)}
                />
            )}

            {showEditModal && profile && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={() => {
                        handleProfileUpdate();
                        setShowEditModal(false);
                    }}
                />
            )}
        </div>
    );
};