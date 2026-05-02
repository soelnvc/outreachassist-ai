import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getUserProfile, saveUserProfile } from '../../services/userProfile.js';
import { SidebarFooter } from '../../components/Footer.jsx';
import { AuthModal } from '../../components/AuthModal.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { getSheetUrl } from '../../services/sheets.js';
import { FiUser, FiClock, FiLink, FiExternalLink, FiChevronRight, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export function SettingsPage() {
  const { currentUser, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const sheetUrl = getSheetUrl();

  const [profile, setProfile] = useState({
    name: '',
    about: '',
    company: '',
    work: '',
    sheetsUrl: '', // This is the Apps Script URL
    viewUrl: ''    // This is the Spreadsheet Link
  });

  useEffect(() => {
    async function loadProfile() {
      if (currentUser) {
        setProfile(prev => ({ ...prev, name: currentUser.displayName || '' }));
        const data = await getUserProfile(currentUser.uid);
        if (data) {
          setProfile(prev => ({ ...prev, ...data }));
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, [currentUser]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!currentUser) return;
    
    setSaving(true);
    setSaveStatus(null);
    try {
      await saveUserProfile(currentUser.uid, profile);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
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
          <Link to="/history" className="nav-link-underline pb-1 transition-colors">History</Link>
          <a href={profile.viewUrl || sheetUrl} target="_blank" rel="noopener noreferrer" className="nav-link-underline pb-1 transition-colors">Logs</a>
          <Link to="/guide" className="nav-link-underline pb-1 transition-colors">How to Use</Link>
          <Link to="/settings" className="nav-link-underline pb-1 transition-colors font-semibold">Settings</Link>
        </nav>

        <SidebarFooter />
      </aside>

      <main className="flex-1 flex flex-col p-6 md:p-12 h-screen overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold font-heading tracking-tight">
            Settings & Profile
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
              className="liquid-button bg-[#E0D0F5]/60 backdrop-blur-sm border border-white/60 shadow-sm text-sm font-bold font-subheading px-5 py-2 rounded-full transition-all z-0"
            >
              <span className="relative z-10">Login / Sign UP</span>
            </button>
          )}
        </header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 max-w-4xl w-full mx-auto"
        >
          {loading ? (
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
              
              {/* 1. Profile Section */}
              <motion.section variants={itemVariants} className="glass-panel rounded-3xl p-8 border border-white/60 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <FiUser className="text-2xl text-[#A78BFA]" />
                  <h3 className="text-xl font-bold font-heading text-gray-900">Your Profile</h3>
                </div>
                <p className="text-sm font-light text-gray-600 mb-8">
                  This information helps the AI craft messages on your behalf. It will establish your credibility and position your outreach naturally.
                </p>
                
                <form onSubmit={handleSave} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-medium font-subheading text-[#2D1B69] uppercase tracking-widest pl-4"> Your Name </label>
                      <input 
                        type="text" 
                        value={profile.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        placeholder="e.g. Sarah Mitchell"
                        className="w-full rounded-2xl px-6 py-3 font-light font-subheading text-gray-800 placeholder-gray-400 glass-input"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-medium font-subheading text-[#2D1B69] uppercase tracking-widest pl-4">Account Email</label>
                      <input 
                        type="email" 
                        value={currentUser.email}
                        disabled
                        className="w-full rounded-2xl px-6 py-3 font-light font-subheading text-gray-500 glass-input opacity-70 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-medium font-subheading text-[#2D1B69] uppercase tracking-widest pl-4">Your Role / Title</label>
                      <input 
                        type="text" 
                        value={profile.work}
                        onChange={(e) => handleFieldChange('work', e.target.value)}
                        placeholder="e.g. SDR at Acme Corp"
                        className="w-full rounded-2xl px-6 py-3 font-light font-subheading text-gray-800 placeholder-gray-400 glass-input"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-medium font-subheading text-[#2D1B69] uppercase tracking-widest pl-4">Company Name</label>
                      <input 
                        type="text" 
                        value={profile.company || ''}
                        onChange={(e) => handleFieldChange('company', e.target.value)}
                        placeholder="e.g. Acme Corp"
                        className="w-full rounded-2xl px-6 py-3 font-light font-subheading text-gray-800 placeholder-gray-400 glass-input"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-medium font-subheading text-[#2D1B69] uppercase tracking-widest pl-4">What You Sell / Your Value Prop</label>
                    <textarea 
                      rows={3}
                      value={profile.about}
                      onChange={(e) => handleFieldChange('about', e.target.value)}
                      placeholder="e.g. We help B2B SaaS companies reduce churn by 40% through automated customer health scoring."
                      className="w-full rounded-2xl px-6 py-4 font-light font-subheading text-gray-800 placeholder-gray-400 glass-input resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-sm font-subheading">
                      {saveStatus === 'success' && (
                        <>
                          <FiCheckCircle className="text-green-500" />
                          <span className="text-green-600">Profile updated!</span>
                        </>
                      )}
                      {saveStatus === 'error' && (
                        <>
                          <FiAlertCircle className="text-red-500" />
                          <span className="text-red-500">Failed to save.</span>
                        </>
                      )}
                    </div>
                    <button 
                      type="submit"
                      disabled={saving}
                      className="liquid-button bg-white/40 border border-white/60 shadow-sm text-sm font-semibold font-subheading px-10 py-3 rounded-full transition-all z-0 disabled:opacity-50"
                    >
                      <span className="relative z-10">{saving ? 'Saving...' : 'Update Profile'}</span>
                    </button>
                  </div>
                </form>
              </motion.section>

              {/* 2. Google Sheets Integration Section */}
              <motion.section variants={itemVariants} className="glass-panel rounded-3xl p-8 border border-white/60 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <FiLink className="text-2xl text-[#A78BFA]" />
                  <h3 className="text-xl font-bold font-heading text-gray-900">Google Sheets Integration</h3>
                </div>
                
                <div className="flex flex-col gap-8">
                  {/* Part 1: Spreadsheet Link */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-medium font-subheading text-[#2D1B69] uppercase tracking-widest pl-4">1. Spreadsheet Link (To View Data)</label>
                    <input 
                      type="text" 
                      value={profile.viewUrl}
                      onChange={(e) => handleFieldChange('viewUrl', e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      className="w-full rounded-2xl px-6 py-3 font-light font-subheading text-gray-800 placeholder-gray-400 glass-input"
                    />
                    <p className="text-[10px] text-gray-500 mt-1 pl-4">
                      The "Logs" button in the sidebar will open this link.
                    </p>
                  </div>

                  {/* Part 2: Apps Script URL */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-medium font-subheading text-[#2D1B69] uppercase tracking-widest pl-4">2. Apps Script URL (To Save Data)</label>
                    <input 
                      type="text" 
                      value={profile.sheetsUrl}
                      onChange={(e) => handleFieldChange('sheetsUrl', e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full rounded-2xl px-6 py-3 font-light font-subheading text-gray-800 placeholder-gray-400 glass-input"
                    />
                    <p className="text-[10px] text-gray-500 mt-1 pl-4">
                      The "Save" button uses this to send data to your sheet. Use the URL ending in <strong>/exec</strong>.
                    </p>
                  </div>

                  <div className="flex items-center justify-end pt-4 border-t border-white/40">
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="liquid-button bg-white/40 border border-white/60 shadow-sm text-sm font-semibold font-subheading px-10 py-3 rounded-full transition-all z-0 disabled:opacity-50"
                    >
                      <span className="relative z-10">{saving ? 'Saving...' : 'Save Integration'}</span>
                    </button>
                  </div>
                </div>
              </motion.section>

              {/* 2. History Section */}
              <motion.section variants={itemVariants} className="glass-panel rounded-3xl p-8 border border-white/60 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FiClock className="text-2xl text-[#A78BFA]" />
                    <h3 className="text-xl font-bold font-heading text-gray-900">Recent Activity</h3>
                  </div>
                  <Link to="/history" className="text-sm font-bold text-[#A78BFA] hover:underline flex items-center gap-1">
                    View All History <FiChevronRight />
                  </Link>
                </div>
                <p className="text-sm font-light text-gray-600 mb-6">
                  Your last few generations are saved here. You can find everything in the main History tab.
                </p>
                <div className="bg-white/20 rounded-2xl p-6 border border-white/40 text-center italic text-gray-500 font-light">
                  Quick access history preview coming soon. Visit the History page for full records.
                </div>
              </motion.section>

              {/* 3. Resources & Support Section */}
              <motion.section variants={itemVariants} className="glass-panel rounded-3xl p-8 border border-white/60 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <FiLink className="text-2xl text-[#A78BFA]" />
                  <h3 className="text-xl font-bold font-heading text-gray-900">Resources & Support</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.a 
                    href={sheetUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.5)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between p-4 bg-white/30 rounded-2xl border border-white/40 transition-colors group"
                  >
                    <div>
                      <h4 className="font-bold text-gray-800">System Logs</h4>
                      <p className="text-xs text-gray-500">Google Sheets data log</p>
                    </div>
                    <FiExternalLink className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </motion.a>
                  
                  <motion.a 
                    href="#" 
                    whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.5)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between p-4 bg-white/30 rounded-2xl border border-white/40 transition-colors group"
                  >
                    <div>
                      <h4 className="font-bold text-gray-800">Contact Support</h4>
                      <p className="text-xs text-gray-500">Get technical help</p>
                    </div>
                    <FiChevronRight className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </motion.a>
                  
                  <motion.div 
                    onClick={() => window.location.href = '/guide'}
                    whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.5)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between p-4 bg-white/30 rounded-2xl border border-white/40 transition-colors group cursor-pointer"
                  >
                    <div>
                      <h4 className="font-bold text-gray-800">Documentation</h4>
                      <p className="text-xs text-gray-500">How to use OutreachAI</p>
                    </div>
                    <FiChevronRight className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </motion.div>
                  
                  <motion.div 
                    onClick={() => window.location.href = '/privacy'}
                    whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.5)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between p-4 bg-white/30 rounded-2xl border border-white/40 transition-colors group cursor-pointer"
                  >
                    <div>
                      <h4 className="font-bold text-gray-800">Privacy Policy</h4>
                      <p className="text-xs text-gray-500">How we handle your data</p>
                    </div>
                    <FiChevronRight className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </motion.div>
                </div>
              </motion.section>

            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
