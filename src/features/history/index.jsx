import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getUserHistory, updateHistorySavedStatus } from '../../services/history.js';
import { getUserProfile } from '../../services/userProfile.js';
import { SidebarFooter } from '../../components/Footer.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { AuthModal } from '../../components/AuthModal.jsx';
import { appendToSheet, getSheetUrl } from '../../services/sheets.js';
import { FiCopy, FiCheck, FiSave, FiLoader, FiExternalLink, FiAlertCircle } from 'react-icons/fi';

export function HistoryPage() {
  const { currentUser, signOut } = useAuth();
  const [history, setHistory] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savingIds, setSavingIds] = useState({}); // { [id]: 'saving' | 'saved' | 'error' }
  const [copiedId, setCopiedId] = useState(null);
  const sheetUrl = getSheetUrl();

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
          
          // Pre-populate savingIds with already saved items from Firestore
          const initialSaved = {};
          historyData.forEach(item => {
            if (item.isSavedToLogs) {
              initialSaved[item.id] = 'saved';
            }
          });
          setSavingIds(initialSaved);
        } catch (error) {
          console.error("Failed to load history or profile", error);
        }
      } else {
        setHistory([]);
        setUserProfile(null);
      }
      setLoading(false);
    }
    
    fetchData();
  }, [currentUser]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToLogs = async (item) => {
    if (savingIds[item.id] === 'saved' || savingIds[item.id] === 'saving') return;
    
    setSavingIds(prev => ({ ...prev, [item.id]: 'saving' }));
    try {
      await appendToSheet({
        prospectName: item.formData.name,
        message: item.generatedMessage,
        ...item.formData
      }, userProfile?.sheetsUrl);
      
      // Persist to Firestore
      await updateHistorySavedStatus(item.id, true);
      
      setSavingIds(prev => ({ ...prev, [item.id]: 'saved' }));
    } catch (error) {
      console.error("Failed to save to logs", error);
      setSavingIds(prev => ({ ...prev, [item.id]: 'error' }));
      setTimeout(() => setSavingIds(prev => ({ ...prev, [item.id]: null })), 3000);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#EAE6F5] via-[#F4F0FB] to-[#FCEEF9] font-sans text-gray-900">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#E0D0F5]/40 backdrop-blur-md border-r border-white/50 flex flex-col justify-between hidden lg:flex sticky top-0 h-screen shadow-lg">
        <div className="p-8">
          <h1 className="text-2xl font-bold font-heading tracking-tight leading-tight text-gray-900 text-center uppercase">
            OutreachAI <br /> Sales <br /> Copilot
          </h1>
          <p className="mt-4 text-[10px] text-center text-gray-600 leading-tight font-medium">
            AI-powered cold outreach <br /> for modern sales teams.
          </p>
        </div>

        <nav className="flex flex-col gap-10 items-center font-light font-subheading text-gray-700 text-base">
          <Link to="/" className="nav-link-underline pb-1 transition-colors">Workspace</Link>
          <Link to="/history" className="nav-link-underline pb-1 transition-colors font-semibold">History</Link>
          <a href={userProfile?.viewUrl || sheetUrl} target="_blank" rel="noopener noreferrer" className="nav-link-underline pb-1 transition-colors">Logs</a>
          <Link to="/guide" className="nav-link-underline pb-1 transition-colors">How to Use</Link>
          <Link to="/settings" className="nav-link-underline pb-1 transition-colors">Settings</Link>
        </nav>

        <SidebarFooter />
      </aside>

      <main className="flex-1 flex flex-col p-6 md:p-12 h-screen overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold font-heading tracking-tight">
            Your Generation History
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1"
        >
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : !currentUser ? (
            <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center gap-4">
              <h3 className="text-2xl font-bold font-heading text-gray-800">Sign in to view history</h3>
              <p className="text-gray-600 font-light max-w-md">Your generated messages will be saved securely to your account for 30 days.</p>
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
              {history.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="glass-panel rounded-3xl p-6 flex flex-col gap-4 border border-white/60 shadow-sm relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2 border-b border-white/40 pb-4">
                    <div>
                      <h3 className="text-lg font-bold font-heading text-gray-900">{item.formData.name || 'Unknown Prospect'}</h3>
                      <p className="text-xs font-light text-gray-500 mt-1 uppercase tracking-wider">
                        {item.formData.buyerPersona || item.formData.profession || 'Role Not Specified'}
                        {(item.formData.industry || item.formData.country) ? ` • ${item.formData.industry || item.formData.country}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}
                      </span>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCopy(item.id, item.generatedMessage)}
                        className={`transition-colors ${copiedId === item.id ? 'text-green-500' : 'text-gray-400 hover:text-gray-900'}`}
                        title="Copy to clipboard"
                      >
                        {copiedId === item.id ? <FiCheck size={18} /> : <FiCopy size={18} />}
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.formData.outreachChannel && (
                      <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                        📨 {item.formData.outreachChannel}
                      </span>
                    )}
                    {item.formData.companySize && (
                      <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                        🏢 {item.formData.companySize}
                      </span>
                    )}
                    {item.formData.tone && (
                      <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                        🎙 {item.formData.tone}
                      </span>
                    )}
                    {item.formData.intent && (
                      <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                        🎯 {item.formData.intent.substring(0, 20)}
                      </span>
                    )}
                    {item.formData.humour && (
                      <span className="px-3 py-1 bg-[#E9D9FA]/50 rounded-full text-[10px] font-bold text-gray-700 uppercase tracking-wide">
                        ✨ Witty Hook
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-white/30 rounded-2xl p-4 mt-2 max-h-48 overflow-y-auto custom-scrollbar border border-white/20">
                    <p className="text-sm font-light text-gray-800 whitespace-pre-wrap leading-relaxed">{item.generatedMessage}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/40">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSaveToLogs(item)}
                      disabled={savingIds[item.id] === 'saving' || savingIds[item.id] === 'saved'}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold font-subheading transition-all ${
                        savingIds[item.id] === 'saved' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : savingIds[item.id] === 'error'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-white/40 text-gray-700 border border-white/60 hover:bg-white/60'
                      }`}
                    >
                      {savingIds[item.id] === 'saving' ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <FiLoader />
                        </motion.div>
                      ) : savingIds[item.id] === 'saved' ? (
                        <FiCheck />
                      ) : savingIds[item.id] === 'error' ? (
                        <FiAlertCircle />
                      ) : (
                        <FiSave />
                      )}
                      <span>
                        {savingIds[item.id] === 'saving' ? 'Saving...' : 
                         savingIds[item.id] === 'saved' ? 'Saved' : 
                         savingIds[item.id] === 'error' ? 'Failed' : 'Save to Logs'}
                      </span>
                    </motion.button>

                    <motion.a
                      href={userProfile?.viewUrl || sheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 2 }}
                      className="text-[10px] font-bold text-gray-400 hover:text-gray-800 flex items-center gap-1 uppercase"
                    >
                      View Log <FiExternalLink size={10} />
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
