import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getUserProfile, saveUserProfile } from '../../services/userProfile.js';
import { getUserHistory } from '../../services/history.js';
import { Sidebar } from '../../components/Sidebar.jsx';
import { AuthModal } from '../../components/AuthModal.jsx';
import { ConfirmationModal } from '../../components/ConfirmationModal.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { getSheetUrl } from '../../services/sheets.js';
import { FiLogOut } from 'react-icons/fi';

// Extracted Components
import { ProfileForm } from './components/ProfileForm.jsx';
import { IntegrationSection } from './components/IntegrationSection.jsx';
import { RecentActivitySection } from './components/RecentActivitySection.jsx';
import { ResourcesSection } from './components/ResourcesSection.jsx';

const SAVE_STATUS_DISPLAY_DURATION_MS = 3000;
const RECENT_HISTORY_LIMIT = 3;

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

/**
 * SettingsPage — displays user profile editing, Google Sheets integration,
 * recent activity preview, and resource links.
 *
 * @returns {JSX.Element}
 */
export function SettingsPage() {
  const { currentUser, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isShowingSignOutConfirm, setIsShowingSignOutConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({
    name: '',
    about: '',
    company: '',
    work: '',
    sheetsUrl: '',
    viewUrl: ''
  });

  const sheetUrl = useMemo(() => getSheetUrl(profile.sheetsUrl), [profile.sheetsUrl]);

  useEffect(() => {
    async function loadData() {
      if (currentUser) {
        setProfile(prev => ({ ...prev, name: currentUser.displayName || '' }));
        try {
          const [profileData, historyData] = await Promise.all([
            getUserProfile(currentUser.uid),
            getUserHistory(currentUser.uid)
          ]);

          if (profileData) {
            setProfile(prev => ({ ...prev, ...profileData }));
          }
          if (historyData) {
            setHistory(historyData.slice(0, RECENT_HISTORY_LIMIT));
          }
        } catch {
          // Settings load failed; page will render with defaults
        }
      }
      setIsLoading(false);
    }
    loadData();
  }, [currentUser]);

  const handleSave = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!currentUser) return;

    setIsSaving(true);
    setSaveStatus(null);
    try {
      await saveUserProfile(currentUser.uid, profile);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), SAVE_STATUS_DISPLAY_DURATION_MS);
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [currentUser, profile]);

  const handleFieldChange = useCallback((field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#EAE6F5] via-[#F4F0FB] to-[#FCEEF9] font-sans text-gray-900">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <ConfirmationModal
        isOpen={isShowingSignOutConfirm}
        onClose={() => setIsShowingSignOutConfirm(false)}
        onConfirm={() => {
          signOut();
          setIsShowingSignOutConfirm(false);
        }}
        title="Sign Out?"
        message="Are you sure you want to sign out of your OutreachAI account?"
        confirmText="Yes, Sign Out"
        confirmColor="bg-red-500 shadow-red-100"
        icon={<FiLogOut className="text-4xl text-red-500" />}
      />

      {/* Sidebar */}
      <Sidebar userProfile={profile} sheetUrl={sheetUrl} />

      <main className="flex-1 flex flex-col p-6 md:p-12 h-screen overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold font-heading tracking-tight">
            Settings & Profile
          </h2>
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-light text-gray-600">{currentUser.email}</span>
              <button
                onClick={() => setIsShowingSignOutConfirm(true)}
                className="liquid-button bg-[#E0D0F5]/60 backdrop-blur-sm border border-white/60 shadow-sm text-sm font-semibold font-subheading px-5 py-2 rounded-full transition-all z-0"
              >
                <span className="relative z-10">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="liquid-button bg-[#E0D0F5]/60 backdrop-blur-sm border border-white/60 shadow-sm text-sm font-bold font-subheading px-5 py-2 rounded-full transition-all z-0"
            >
              <span className="relative z-10">Login / Sign Up</span>
            </button>
          )}
        </header>

        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
          className="flex-1 max-w-4xl w-full mx-auto"
        >
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : !currentUser ? (
            <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center gap-4">
              <h3 className="text-2xl font-bold font-heading text-gray-800">Sign in to manage settings</h3>
              <p className="text-gray-600 font-light max-w-md">Create a profile to personalize your generated messages with your own background and context.</p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="liquid-button mt-4 bg-white/60 backdrop-blur-sm border border-white shadow-sm text-sm font-semibold font-subheading px-8 py-3 rounded-full transition-all z-0"
              >
                <span className="relative z-10">Login Now</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-12 pb-20">
              <ProfileForm
                profile={profile}
                onFieldChange={handleFieldChange}
                onSave={handleSave}
                isSaving={isSaving}
                saveStatus={saveStatus}
                userEmail={currentUser.email}
                itemVariants={ITEM_VARIANTS}
              />

              <IntegrationSection
                profile={profile}
                onFieldChange={handleFieldChange}
                onSave={handleSave}
                isSaving={isSaving}
                itemVariants={ITEM_VARIANTS}
              />

              <RecentActivitySection
                history={history}
                limit={RECENT_HISTORY_LIMIT}
                itemVariants={ITEM_VARIANTS}
              />

              <ResourcesSection
                sheetUrl={sheetUrl}
                itemVariants={ITEM_VARIANTS}
              />
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
