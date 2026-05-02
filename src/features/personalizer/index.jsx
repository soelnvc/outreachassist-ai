import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { InputForm } from '../../components/InputForm.jsx';
import { OutputCard } from '../../components/OutputCard.jsx';
import { ErrorMessage } from '../../components/ErrorMessage.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { validateProspectInput } from '../../utils/validators.js';
import { buildPersonalizerPrompt } from '../../prompts/index.js';
import { callGemini } from '../../services/gemini.js';
import { parseApiResponse } from '../../utils/parseResponse.js';
import { appendToSheet, getSheetUrl } from '../../services/sheets.js';
import { SidebarFooter, AIDisclaimer } from '../../components/Footer.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { AuthModal } from '../../components/AuthModal.jsx';
import { saveHistory, updateHistorySavedStatus } from '../../services/history.js';
import { getUserProfile } from '../../services/userProfile.js';

/**
 * PersonalizerPage — the main feature page that wires form input to prompt
 * building, Gemini API calls, response parsing, and Google Sheets logging.
 */
export function PersonalizerPage() {
  const { currentUser, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [currentHistoryId, setCurrentHistoryId] = useState(null);
  
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
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [sheetStatus, setSheetStatus] = useState(null);

  const abortControllerRef = useRef(null);
  const sheetUrl = useMemo(() => getSheetUrl(), []);

  const handleFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCopy = useCallback(() => {
    if (result?.message) {
      navigator.clipboard.writeText(result.message);
    }
  }, [result]);

  const handleSave = useCallback(() => {
    if (!result?.message) return;
    setSheetStatus('saving');
    appendToSheet({ ...formData, message: result.message }, userProfile?.sheetsUrl)
      .then(async () => {
        setSheetStatus('saved');
        // Persist to Firestore if we have a history ID
        if (currentHistoryId) {
          try {
            await updateHistorySavedStatus(currentHistoryId, true);
          } catch (err) {
            console.error("Failed to update history saved status:", err);
          }
        }
      })
      .catch(() => setSheetStatus('error'));
  }, [formData, result, currentHistoryId]);

  const handleSubmit = useCallback(async () => {
    const validation = validateProspectInput(formData);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setResult(null);
    setError(null);
    setSheetStatus(null);
    setCurrentHistoryId(null);
    setIsLoading(true);

    try {
      const prompt = buildPersonalizerPrompt(formData, userProfile);
      const rawResponse = await callGemini(prompt, abortControllerRef.current.signal);
      const parsed = parseApiResponse(rawResponse);
      setResult(parsed);
      
      // Save to Firebase History if logged in
      if (currentUser && parsed?.message) {
        saveHistory(currentUser.uid, formData, parsed.message)
          .then(id => {
            setCurrentHistoryId(id);
          })
          .catch(err => {
            console.error("Failed to save history:", err);
          });
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, currentUser, userProfile]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#EAE6F5] via-[#F4F0FB] to-[#FCEEF9] font-sans text-gray-900">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#E0D0F5]/40 backdrop-blur-md border-r border-white/50 flex flex-col justify-between hidden lg:flex sticky top-0 h-screen shadow-lg">
        {/* Top: Logo Section */}
        <div className="p-8">
          <h1 className="text-2xl font-bold font-heading tracking-tight leading-tight text-gray-900 text-center uppercase">
            OutreachAI <br /> Sales <br /> Copilot
          </h1>
          <p className="mt-4 text-[10px] text-center text-gray-600 leading-tight font-medium">
            AI-powered cold outreach <br /> for modern sales teams.
          </p>
        </div>

        {/* Middle: Navigation Links Section */}
        <nav className="flex flex-col gap-10 items-center font-light font-subheading text-gray-700 text-base">
          <Link to="/" className="nav-link-underline pb-1 transition-colors font-semibold">Workspace</Link>
          <Link to="/history" className="nav-link-underline pb-1 transition-colors">History</Link>
          <a href={userProfile?.viewUrl || sheetUrl} target="_blank" rel="noopener noreferrer" className="nav-link-underline pb-1 transition-colors">Logs</a>
          <Link to="/guide" className="nav-link-underline pb-1 transition-colors">How to Use</Link>
          <Link to="/settings" className="nav-link-underline pb-1 transition-colors">Settings</Link>
        </nav>

        {/* Bottom: Footer Section */}
        <SidebarFooter />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-6 md:p-12 h-screen overflow-y-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold font-heading tracking-tight">
            Welcome Back, <span className="bg-gradient-to-r from-[#F472B6] to-[#FDE047] bg-clip-text text-transparent">
              {userProfile?.name?.split(' ')[0] || currentUser?.displayName?.split(' ')[0] || 'there'}
            </span>
          </h2>
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-light text-gray-600">{currentUser.email}</span>
              <button 
                onClick={signOut}
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
              <span className="relative z-10">Login / Sign UP</span>
            </button>
          )}
        </header>

        {/* Content Wrapper with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
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

          <ErrorMessage message={error} />

          {isLoading && (
            <LoadingSpinner message="Crafting your personalised message..." />
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <OutputCard
                message={result.message}
                onCopy={handleCopy}
                onSave={handleSave}
                sheetStatus={sheetStatus}
                sheetUrl={userProfile?.viewUrl || userProfile?.sheetsUrl || sheetUrl}
              />
            </motion.div>
          )}

          <AIDisclaimer />
        </motion.div>
      </main>
    </div>
  );
}
