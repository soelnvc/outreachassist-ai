import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getUserHistory } from '../../services/history.js';
import { SidebarFooter } from '../../components/Footer.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { AuthModal } from '../../components/AuthModal.jsx';

import { getSheetUrl } from '../../services/sheets.js';

export function HistoryPage() {
  const { currentUser, signOut } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const sheetUrl = getSheetUrl();

  useEffect(() => {
    async function fetchHistory() {
      if (currentUser) {
        try {
          const data = await getUserHistory(currentUser.uid);
          setHistory(data);
        } catch (error) {
          console.error("Failed to load history", error);
        }
      } else {
        setHistory([]);
      }
      setLoading(false);
    }
    
    fetchHistory();
  }, [currentUser]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#EAE6F5] via-[#F4F0FB] to-[#FCEEF9] font-sans text-gray-900">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {/* Sidebar - Duplicated for now, could be extracted to a shared component */}
      <aside className="w-64 bg-[#E0D0F5]/40 backdrop-blur-md border-r border-white/50 flex flex-col justify-between hidden lg:flex sticky top-0 h-screen shadow-lg">
        <div className="p-8">
          <h1 className="text-2xl font-bold font-heading tracking-tight leading-tight text-gray-900 text-center uppercase">
            OutreachAI <br /> Message <br /> Personalizer
          </h1>
          <p className="mt-4 text-[10px] text-center text-gray-600 leading-tight font-medium">
            Generate hyper-personalised cold <br /> outreach messages in seconds.
          </p>
        </div>

        <nav className="flex flex-col gap-10 items-center font-light font-subheading text-gray-700 text-base">
          <Link to="/" className="nav-link-underline pb-1 transition-colors">Workspace</Link>
          <Link to="/history" className="nav-link-underline pb-1 transition-colors font-semibold">History</Link>
          <a href={sheetUrl} target="_blank" rel="noopener noreferrer" className="nav-link-underline pb-1 transition-colors">Logs</a>
          <a href="#" className="nav-link-underline pb-1 transition-colors">How to Use</a>
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
                className="liquid-button bg-[#E0D0F5]/60 backdrop-blur-sm border border-white/60 shadow-sm text-sm font-bold font-subheading px-5 py-2 rounded-full transition-all z-0"
              >
                <span className="relative z-10">Sign Out</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="liquid-button bg-[#E0D0F5]/60 backdrop-blur-sm border border-white/60 shadow-sm text-sm font-bold font-subheading px-5 py-2 rounded-full transition-all z-0"
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
                className="liquid-button mt-4 bg-white/60 backdrop-blur-sm border border-white shadow-sm text-sm font-bold font-subheading px-8 py-3 rounded-full transition-all z-0"
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
                className="liquid-button mt-4 bg-white/60 backdrop-blur-sm border border-white shadow-sm text-sm font-bold font-subheading px-8 py-3 rounded-full transition-all z-0"
              >
                <span className="relative z-10">Go to Workspace</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                  transition={{ duration: 0.4, delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-panel rounded-3xl p-6 flex flex-col gap-4 border border-white/60 shadow-sm relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2 border-b border-white/40 pb-4">
                    <div>
                      <h3 className="text-lg font-bold font-heading text-gray-900">{item.formData.name || 'Unknown Prospect'}</h3>
                      <p className="text-xs font-light text-gray-500 mt-1 uppercase tracking-wider">
                        {item.formData.profession || 'Profession Not Specified'}
                        {item.formData.country ? ` • ${item.formData.country}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-light text-gray-400">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}
                      </span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(item.generatedMessage)}
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                        title="Copy to clipboard"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.formData.intent && (
                      <span className="px-3 py-1 bg-white/50 rounded-full text-xs font-light text-gray-700">
                        🎯 {item.formData.intent.substring(0, 30)}{item.formData.intent.length > 30 ? '...' : ''}
                      </span>
                    )}
                    {item.formData.gender && (
                      <span className="px-3 py-1 bg-white/50 rounded-full text-xs font-light text-gray-700">
                        {item.formData.gender}
                      </span>
                    )}
                    {item.formData.ageRange && (
                      <span className="px-3 py-1 bg-white/50 rounded-full text-xs font-light text-gray-700">
                        {item.formData.ageRange}
                      </span>
                    )}
                    {item.formData.maritalStatus && (
                      <span className="px-3 py-1 bg-white/50 rounded-full text-xs font-light text-gray-700">
                        {item.formData.maritalStatus}
                      </span>
                    )}
                    {item.formData.humour && (
                      <span className="px-3 py-1 bg-[#E9D9FA]/50 rounded-full text-xs font-light text-gray-700">
                        ✨ Witty
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-white/30 rounded-2xl p-4 mt-2 max-h-48 overflow-y-auto custom-scrollbar">
                    <p className="text-sm font-light text-gray-800 whitespace-pre-wrap">{item.generatedMessage}</p>
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
