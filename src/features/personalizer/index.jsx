import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { InputForm } from '../../components/InputForm.jsx';
import { OutputCard } from '../../components/OutputCard.jsx';
import { ErrorMessage } from '../../components/ErrorMessage.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { validateProspectInput, sanitizeInput } from '../../utils/validators.js';
import { buildPersonalizerPrompt } from '../../prompts/index.js';
import { callGemini } from '../../services/gemini.js';
import { parseApiResponse } from '../../utils/parseResponse.js';
import { appendToSheet, getSheetUrl } from '../../services/sheets.js';
import { Sidebar } from '../../components/Sidebar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { AuthModal } from '../../components/AuthModal.jsx';
import { saveHistory, updateHistorySavedStatus } from '../../services/history.js';
import { getUserProfile } from '../../services/userProfile.js';
import { AIDisclaimer } from '../../components/Footer.jsx';
import { ConfirmationModal } from '../../components/ConfirmationModal.jsx';
import { FiLogOut } from 'react-icons/fi';
import { PersonalizerHeader } from './components/PersonalizerHeader.jsx';

/**
 * PersonalizerPage — the main feature page that wires form input to prompt
 * building, Gemini API calls, response parsing, and Google Sheets logging.
 *
 * @returns {JSX.Element}
 */
export function PersonalizerPage() {
  const { currentUser, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [currentHistoryId, setCurrentHistoryId] = useState(null);
  const [isShowingSignOutConfirm, setIsShowingSignOutConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    prospectInfo: '',
    intent: '',
    outreachChannel: null,
    companySize: null,
    tone: null,
    industry: null,
    buyerPersona: null,
    humour: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generationResult, setGenerationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [sheetStatus, setSheetStatus] = useState(null);

  const abortControllerRef = useRef(null);
  const sheetUrl = useMemo(() => getSheetUrl(), []);

  useEffect(() => {
    async function loadProfile() {
      if (currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    }
    loadProfile();
  }, [currentUser]);

  const handleFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCopy = useCallback(() => {
    if (generationResult?.message) {
      navigator.clipboard.writeText(generationResult.message);
    }
  }, [generationResult]);

  const handleSave = useCallback(() => {
    if (!generationResult?.message) return;
    setSheetStatus('saving');
    appendToSheet({ ...formData, message: generationResult.message })
      .then(async () => {
        setSheetStatus('saved');
        if (currentHistoryId) {
          try {
            await updateHistorySavedStatus(currentHistoryId, true);
          } catch {
            // Non-critical: sheet was saved, history flag update failed silently
          }
        }
      })
      .catch(() => setSheetStatus('error'));
  }, [formData, generationResult, currentHistoryId, userProfile]);

  const handleSubmit = useCallback(async () => {
    const validation = validateProspectInput(formData);
    if (!validation.valid) {
      setErrorMessage(validation.error);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setGenerationResult(null);
    setErrorMessage(null);
    setSheetStatus(null);
    setCurrentHistoryId(null);
    setIsLoading(true);

    try {
      const sanitizedData = {
        ...formData,
        prospectInfo: sanitizeInput(formData.prospectInfo),
        intent: formData.intent ? sanitizeInput(formData.intent) : '',
        name: formData.name ? sanitizeInput(formData.name) : ''
      };

      const prompt = buildPersonalizerPrompt(sanitizedData, userProfile);
      const rawResponse = await callGemini(prompt, abortControllerRef.current.signal);
      const parsed = parseApiResponse(rawResponse);
      setGenerationResult(parsed);

      if (currentUser && parsed?.message) {
        saveHistory(currentUser.uid, formData, parsed.message)
          .then(id => {
            setCurrentHistoryId(id);
          })
          .catch(() => {
            // Non-critical: generation succeeded, history save failed silently
          });
      }
    } catch (submitError) {
      if (submitError.name === 'AbortError') return;
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, currentUser, userProfile]);

  const finalSheetUrl = useMemo(() => 
    userProfile?.viewUrl || userProfile?.sheetsUrl || sheetUrl,
  [userProfile, sheetUrl]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#EAE6F5] via-[#F4F0FB] to-[#FCEEF9] font-sans text-gray-900">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <Sidebar userProfile={userProfile} sheetUrl={sheetUrl} />

      <main className="flex-1 flex flex-col p-6 md:p-12 h-screen overflow-y-auto">
        <PersonalizerHeader
          currentUser={currentUser}
          userProfile={userProfile}
          onLoginClick={() => setIsAuthModalOpen(true)}
          onSignOutClick={() => setIsShowingSignOutConfirm(true)}
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
          className="flex-1 flex flex-col"
        >
          <section aria-labelledby="form-heading" className="flex-1">
            <h2 id="form-heading" className="sr-only">Message generator form</h2>
            <InputForm
              formData={formData}
              onFieldChange={handleFieldChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </section>

          <ErrorMessage message={errorMessage} />

          {isLoading && (
            <LoadingSpinner message="Crafting your personalised message..." />
          )}

          <div aria-live="polite" aria-atomic="true">
            {generationResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <OutputCard
                  message={generationResult.message}
                  onCopy={handleCopy}
                  onSave={handleSave}
                  sheetStatus={sheetStatus}
                  sheetUrl={finalSheetUrl}
                />
              </motion.div>
            )}
          </div>

          <AIDisclaimer />
        </motion.div>
      </main>
    </div>
  );
}
