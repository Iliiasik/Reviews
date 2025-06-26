import {useState, useRef, useEffect} from 'react';
import { gsap } from 'gsap';
import { useProfile } from '../model/useProfile';
import { useProfileActions } from '../model/useProfileActions';
import { useQrCode } from '../model/useQrCode';
import { ProfileHeader } from './ProfileHeader';
import { ProfileTab } from './ProfileTab';
import { ReviewsTab } from './ReviewsTab';
import { QrTab } from './QrTab';
import { ChangePasswordModal } from '@features/profile/ui/ChangePasswordModal';
import { EditProfileModal } from './EditProfileModal';

export const ProfileContent = () => {
    const { profile, isLoading, handleProfileUpdate } = useProfile();
    const { handleLogout } = useProfileActions();
    const { qrUrl, generate, download } = useQrCode();
    const [activeTab, setActiveTab] = useState('profile');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const profileRef = useRef<HTMLDivElement>(null);
    const reviewsRef = useRef<HTMLDivElement>(null);
    const qrRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeTab === 'reviews' && reviewsRef.current) {
            gsap.from(reviewsRef.current, {
                opacity: 0, x: -20, duration: 0.3, ease: "power2.out"
            });
        } else if (activeTab === 'qr' && qrRef.current) {
            gsap.from(qrRef.current, {
                opacity: 0, x: 20, duration: 0.3, ease: "power2.out"
            });
        } else if (profileRef.current) {
            gsap.from(profileRef.current, {
                opacity: 0, y: 20, duration: 0.3, ease: "power2.out"
            });
        }
    }, [activeTab]);

    return (
        <div className="max-w-6xl mx-auto">
            <ProfileHeader
                profile={profile}
                activeTab={activeTab}
                onTabChange={setActiveTab}
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
                    <ReviewsTab ref={reviewsRef} profile={profile} />
                )}

                {(activeTab === 'qr' && (profile?.role === 'specialist' || profile?.role === 'organization')) && (
                    <QrTab
                        ref={qrRef}
                        qrCode={qrUrl}
                        onGenerate={generate}
                        onDownload={download}
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