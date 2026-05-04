import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getUserHistory, updateHistorySavedStatus, deleteHistoryItem, clearUserHistory } from '../../services/history.js';
import { getUserProfile } from '../../services/userProfile.js';
import { Sidebar } from '../../components/Sidebar.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { AuthModal } from '../../components/AuthModal.jsx';
import { appendToSheet, getSheetUrl } from '../../services/sheets.js';
import { FiAlertCircle, FiTrash2, FiLogOut } from 'react-icons/fi';
import { ConfirmationModal } from '../../components/ConfirmationModal.jsx';
import { HistoryItemCard } from './components/HistoryItemCard.jsx';

const COPY_FEEDBACK_DURATION_MS = 2000;
const SAVE_ERROR_RESET_DELAY_MS = 3000;
const HISTORY_RETENTION_DAYS = 30;

/**
 * Builds the initial savingIds map from already-saved history items.
 *
 * @param {Array<Object>} historyData - Array of history records
 * @returns {Object} Map of { [id]: 'saved' } for already-saved items
 */
function buildInitialSavedMap(historyData) {
  const initialSaved = {};
  for (const entry of historyData) {
    if (entry.isSavedToLogs) {
      initialSaved[entry.id] = 'saved';
    }
  }
  return initialSaved;
}

/**
 * HistoryPage — displays the user's generated message history with
 * copy, save-to-logs, delete, and clear-all actions.
 *
 * @returns {JSX.Element}
 */
export function HistoryPage() {
  const { currentUser, signOut } = useAuth();
  const [history, setHistory] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savingIds, setSavingIds] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isShowingSignOutConfirm, setIsShowingSignOutConfirm] = useState(false);
  const sheetUrl = useMemo(() => getSheetUrl(), []);

  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        try {
          const [historyData, profileData] = await Promise.all([
            getUserHistory(currentUser.uid),
            getUserProfile(currentUser.uid)
          ]);

          setHistory(historyData);
          setUserProfile(profileData);
          setSavingIds(buildInitialSavedMap(historyData));
        } catch {
          // Data fetch failed; page will render empty state
        }
      } else {
        setHistory([]);
        setUserProfile(null);
      }
      setIsLoading(false);
    }

    fetchData();
  }, [currentUser]);

  const handleCopy = useCallback((id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), COPY_FEEDBACK_DURATION_MS);
  }, []);

  const handleSaveToLogs = useCallback(async (historyItem) => {
    if (savingIds[historyItem.id] === 'saved' || savingIds[historyItem.id] === 'saving') return;

    setSavingIds(prev => ({ ...prev, [historyItem.id]: 'saving' }));
    try {
      await appendToSheet({
        prospectName: historyItem.formData.name,
        message: historyItem.generatedMessage,
        ...historyItem.formData
      }, userProfile?.sheetsUrl);

      await updateHistorySavedStatus(historyItem.id, true);

      setSavingIds(prev => ({ ...prev, [historyItem.id]: 'saved' }));
    } catch {
      setSavingIds(prev => ({ ...prev, [historyItem.id]: 'error' }));
      setTimeout(() => setSavingIds(prev => ({ ...prev, [historyItem.id]: null })), SAVE_ERROR_RESET_DELAY_MS);
    }
  }, [savingIds, userProfile]);

  const handleDeleteItem = useCallback(async (id) => {
    try {
      await deleteHistoryItem(id);
      setHistory(prev => prev.filter(entry => entry.id !== id));
    } catch {
      // Delete failed silently — item remains in list
    }
  }, []);

  const handleClearAll = useCallback(async () => {
    if (!currentUser) return;
    try {
      await clearUserHistory(currentUser.uid);
      setHistory([]);
      setIsConfirmingClear(false);
    } catch {
      // Clear failed silently
    }
  }, [currentUser]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#EAE6F5] via-[#F4F0FB] to-[#FCEEF9] font-sans text-gray-900">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <Sidebar userProfile={userProfile} sheetUrl={sheetUrl} />

      <main className="flex-1 flex flex-col p-6 md:p-12 h-screen overflow-y-auto">
        <header className="flex justify-between items-start mb-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-4xl font-bold font-heading tracking-tight">
              Your Generation History
            </h2>
            <p className="text-[10px] font-light text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <FiAlertCircle size={10} /> History is automatically cleared every {HISTORY_RETENTION_DAYS} days.
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
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
                className="liquid-button bg-[#E0D0F5]/60 backdrop-blur-sm border border-white/60 shadow-sm text-sm font-semibold font-subheading px-5 py-2 rounded-full transition-all z-0"
              >
                <span className="relative z-10">Login / Sign Up</span>
              </button>
            )}

            {currentUser && history.length > 0 && (
              <button
                onClick={() => setIsConfirmingClear(true)}
                className="text-[10px] font-semibold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-1"
              >
                Empty History <FiTrash2 size={10} />
              </button>
            )}
          </div>
        </header>

        <ConfirmationModal
          isOpen={isConfirmingClear}
          onClose={() => setIsConfirmingClear(false)}
          onConfirm={handleClearAll}
          title="Clear All History?"
          message="This will permanently delete all your generated messages. This action cannot be undone."
          confirmText="Yes, Clear Everything"
          confirmColor="bg-red-500 shadow-red-100"
          icon={<FiTrash2 className="text-4xl text-red-500" />}
        />

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex-1"
        >
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : !currentUser ? (
            <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center gap-4">
              <h3 className="text-2xl font-bold font-heading text-gray-800">Sign in to view history</h3>
              <p className="text-gray-600 font-light max-w-md">Your generated messages will be saved securely to your account for {HISTORY_RETENTION_DAYS} days.</p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="liquid-button mt-4 bg-white/60 backdrop-blur-sm border border-white shadow-sm text-sm font-semibold font-subheading px-8 py-3 rounded-full transition-all z-0"
              >
                <span className="relative z-10">Login Now</span>
              </button>
            </div>
          ) : history.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center gap-4">
              <h3 className="text-2xl font-bold font-heading text-gray-800">No history yet</h3>
              <p className="text-gray-600 font-light max-w-md">Go to the workspace to generate your first personalized message!</p>
              <Link
                to="/"
                className="liquid-button mt-4 bg-white/60 backdrop-blur-sm border border-white shadow-sm text-sm font-semibold font-subheading px-8 py-3 rounded-full transition-all z-0"
              >
                <span className="relative z-10">Go to Workspace</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
              {history.map((historyItem, index) => (
                <HistoryItemCard
                  key={historyItem.id}
                  historyItem={historyItem}
                  index={index}
                  copiedId={copiedId}
                  savingIds={savingIds}
                  deletingId={deletingId}
                  onCopy={handleCopy}
                  onDeleteInit={setDeletingId}
                  onDeleteCancel={() => setDeletingId(null)}
                  onDeleteConfirm={handleDeleteItem}
                  onSave={handleSaveToLogs}
                  viewLogUrl={userProfile?.viewUrl || sheetUrl}
                />
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
