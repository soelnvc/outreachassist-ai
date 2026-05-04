import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiBookOpen, 
  FiUser, 
  FiLayout, 
  FiDatabase, 
  FiArrowRight,
  FiShield,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Sidebar } from '../../components/Sidebar.jsx';
import { ConfirmationModal } from '../../components/ConfirmationModal.jsx';
import { getUserProfile } from '../../services/userProfile.js';
import { getSheetUrl } from '../../services/sheets.js';

// Extracted Content Sections
import { 
  OverviewSection, 
  ProfileSetupSection, 
  WorkspaceSection, 
  SheetsSection, 
  BestPracticesSection 
} from './components/GuideSections.jsx';

const COPY_FEEDBACK_DURATION_MS = 2000;

/**
 * GuidePage — documentation and how-to guide for using OutreachAI,
 * including Apps Script setup instructions.
 *
 * @returns {JSX.Element}
 */
export function GuidePage() {
  const { currentUser, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isShowingSignOutConfirm, setIsShowingSignOutConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isCopied, setIsCopied] = useState(false);
  const sheetUrl = useMemo(() => getSheetUrl(), []);

  useEffect(() => {
    async function loadProfile() {
      if (currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
      }
    }
    loadProfile();
  }, [currentUser]);

  const scriptCode = useMemo(() => `function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    const row = [
      new Date(),
      data.outreachChannel,
      data.industry,
      data.companySize,
      data.tone,
      data.buyerPersona,
      data.prospectSnippet,
      data.intent,
      data.message
    ];
    
    sheet.appendRow(row);
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}`, []);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(scriptCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), COPY_FEEDBACK_DURATION_MS);
  }, [scriptCode]);

  const sections = useMemo(() => [
    { id: 'overview', title: 'Overview', icon: <FiBookOpen /> },
    { id: 'profile', title: 'Profile Setup', icon: <FiUser /> },
    { id: 'workspace', title: 'Workspace', icon: <FiLayout /> },
    { id: 'sheets', title: 'Sheets Integration', icon: <FiDatabase /> },
    { id: 'best-practices', title: 'Best Practices', icon: <FiShield /> },
  ], []);

  const scrollToSection = useCallback((id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#EAE6F5] via-[#F4F0FB] to-[#FCEEF9] font-sans text-gray-900">
      
      <Sidebar userProfile={userProfile} sheetUrl={sheetUrl} />

      <main className="flex-1 flex overflow-hidden h-screen">
        {/* Section Navigation Sidebar */}
        <nav className="w-64 border-r border-white/40 p-8 hidden lg:flex flex-col gap-2">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pl-4">Guide Sections</h3>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-medium ${
                activeSection === section.id 
                  ? 'bg-white shadow-sm text-[#A78BFA]' 
                  : 'text-gray-600 hover:bg-white/40'
              }`}
            >
              {section.icon}
              {section.title}
            </button>
          ))}
        </nav>

        {/* Content Scroll Area */}
        <div className="flex-1 p-8 md:p-16 overflow-y-auto scroll-smooth custom-scrollbar">
          <header className="mb-16 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-4xl font-bold font-heading tracking-tight">User Guide</h2>
              <p className="text-gray-500 mt-2 font-light">Mastering personalized outreach with OutreachAI.</p>
            </motion.div>
            {currentUser && (
              <button 
                onClick={() => setIsShowingSignOutConfirm(true)}
                className="bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm text-sm font-semibold px-5 py-2 rounded-full hover:bg-white transition-all"
              >
                Sign Out
              </button>
            )}
          </header>

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

          <div className="max-w-4xl space-y-32 pb-32">
            <div id="overview"><OverviewSection /></div>
            <div id="profile"><ProfileSetupSection /></div>
            <div id="workspace"><WorkspaceSection /></div>
            <div id="sheets"><SheetsSection scriptCode={scriptCode} isCopied={isCopied} onCopy={handleCopyCode} /></div>
            <div id="best-practices"><BestPracticesSection /></div>
          </div>

          <footer className="mt-20 pt-12 border-t border-white/40 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center text-center">
              <h4 className="text-xl font-bold font-heading text-gray-900 mb-2">Ready to start?</h4>
              <p className="text-gray-500 font-light mb-6">Head back to the workspace and build your first AI sales copilot hook.</p>
              <Link 
                to="/" 
                className="liquid-button bg-[#A78BFA] text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-[#A78BFA]/20 flex items-center gap-2"
              >
                <span className="relative z-10">Back to Workspace</span>
                <FiArrowRight className="relative z-10" />
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
