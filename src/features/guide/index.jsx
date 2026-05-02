import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiBook, 
  FiUser, 
  FiLayout, 
  FiDatabase, 
  FiCheckCircle, 
  FiCopy, 
  FiExternalLink,
  FiArrowRight,
  FiZap,
  FiShield
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { SidebarFooter } from '../../components/Footer.jsx';
import { getUserProfile } from '../../services/userProfile.js';

export function GuidePage() {
  const { currentUser, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
      }
    }
    loadProfile();
  }, [currentUser]);

  const scriptCode = `function doPost(e) {
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
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = [
    { id: 'overview', title: 'Overview', icon: <FiBook /> },
    { id: 'profile', title: 'Profile Setup', icon: <FiUser /> },
    { id: 'workspace', title: 'Workspace', icon: <FiLayout /> },
    { id: 'sheets', title: 'Sheets Integration', icon: <FiDatabase /> },
    { id: 'best-practices', title: 'Best Practices', icon: <FiShield /> },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#EAE6F5] via-[#F4F0FB] to-[#FCEEF9] font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#E0D0F5]/40 backdrop-blur-md border-r border-white/50 flex flex-col justify-between hidden lg:flex sticky top-0 h-screen shadow-lg">
        <div className="p-8">
          <h1 className="text-2xl font-bold font-heading tracking-tight leading-tight text-gray-900 text-center uppercase">
            OutreachAI <br /> Sales <br /> Copilot
          </h1>
          <p className="mt-4 text-[10px] text-center text-gray-600 leading-tight font-medium">
            Master the art of <br /> B2B personalization.
          </p>
        </div>

        <nav className="flex flex-col gap-10 items-center font-light font-subheading text-gray-700 text-base">
          <Link to="/" className="nav-link-underline pb-1 transition-colors">Workspace</Link>
          <Link to="/history" className="nav-link-underline pb-1 transition-colors">History</Link>
          <a href={userProfile?.viewUrl || "#"} target="_blank" rel="noopener noreferrer" className="nav-link-underline pb-1 transition-colors">Logs</a>
          <Link to="/guide" className="nav-link-underline pb-1 transition-colors font-semibold">How to Use</Link>
          <Link to="/settings" className="nav-link-underline pb-1 transition-colors">Settings</Link>
        </nav>

        <SidebarFooter />
      </aside>

      <main className="flex-1 flex flex-row h-screen overflow-hidden">
        
        {/* Local Navigation Menu */}
        <nav className="w-72 bg-white/20 backdrop-blur-sm border-r border-white/40 p-8 hidden xl:flex flex-col gap-4 overflow-y-auto">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Documentation</h3>
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
          <header className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-[#A78BFA] font-bold text-xs uppercase tracking-[0.2em]">User Guide</span>
              <h2 className="text-5xl font-bold font-heading tracking-tight mt-4">
                Getting Started with <br /> <span className="bg-gradient-to-r from-[#F472B6] to-[#FDE047] bg-clip-text text-transparent italic">OutreachAI</span>
              </h2>
            </motion.div>
          </header>

          <div className="max-w-4xl space-y-24 pb-32">
            
            {/* Overview Section */}
            <section id="overview" className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-bold font-heading">
                <FiZap className="text-yellow-500" />
                <h3>Overview</h3>
              </div>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                OutreachAI is an elite B2B Sales Copilot designed to eliminate the generic "spray and pray" approach to cold outreach. 
                Our AI acts as your personal copywriting strategist, blending your unique value proposition with deep prospect research 
                to generate messages that actually get replies.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="glass-panel p-6 rounded-3xl border border-white/60">
                  <h4 className="font-bold mb-2">Zero Hallucinations</h4>
                  <p className="text-sm text-gray-500 font-light">Strict prompt engineering ensures the AI never makes up facts about your company or product.</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl border border-white/60">
                  <h4 className="font-bold mb-2">Data Ownership</h4>
                  <p className="text-sm text-gray-500 font-light">With our "Bring Your Own Sheet" architecture, your sales data stays in your personal Google environment.</p>
                </div>
              </div>
            </section>

            {/* Profile Setup Section */}
            <section id="profile" className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-bold font-heading">
                <FiUser className="text-[#A78BFA]" />
                <h3>1. Setting Up Your Profile</h3>
              </div>
              <p className="text-gray-600 font-light leading-relaxed">
                Before generating your first message, head over to the **Settings** page. The AI needs to know who you are to write authentically.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start">
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0 mt-1">1</span>
                  <div>
                    <strong className="block text-gray-900">Company & Role</strong>
                    <span className="text-sm text-gray-500 font-light text-center">Enter your current title and company name. This replaces generic placeholders.</span>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0 mt-1">2</span>
                  <div>
                    <strong className="block text-gray-900">Value Proposition</strong>
                    <span className="text-sm text-gray-500 font-light">Describe what you do in 1-2 sentences. Focus on the <em>problem</em> you solve for your clients.</span>
                  </div>
                </li>
              </ul>
              <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl flex gap-4 items-start">
                <FiCheckCircle className="text-blue-500 mt-1" />
                <p className="text-sm text-blue-800 italic">"I help SaaS founders automate their sales cycle using AI." is better than "I am a salesperson at Acme Corp."</p>
              </div>
            </section>

            {/* Workspace Masterclass */}
            <section id="workspace" className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-bold font-heading">
                <FiLayout className="text-[#A78BFA]" />
                <h3>2. Workspace Masterclass</h3>
              </div>
              <div className="glass-panel rounded-3xl p-8 border border-white/60 space-y-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Input Strategy</h4>
                  <p className="text-sm text-gray-600 font-light">Don't just paste a LinkedIn bio. Paste recent news, a specific pain point from their last report, or a common challenge their industry faces.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Firmographics</h5>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      Select the <strong>Outreach Channel</strong> (LinkedIn for short & punchy, Email for detailed) and <strong>Tone</strong>. 
                      The AI adjusts the word count and structure automatically.
                    </p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Buyer Persona</h5>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      Enable the <strong>Witty Hook</strong> feature to add a subtle, professional touch of humor to the first line. 
                      Perfect for breaking the ice with busy executives.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Sheets Integration Section */}
            <section id="sheets" className="space-y-10">
              <div className="flex items-center gap-3 text-2xl font-bold font-heading">
                <FiDatabase className="text-[#A78BFA]" />
                <h3>3. Google Sheets Integration</h3>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-600 font-light leading-relaxed">
                  Connect your personal spreadsheet to log every successful outreach. This is the most powerful part of OutreachAI.
                </p>

                <div className="space-y-12 mt-8">
                  {/* Step A */}
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl font-bold flex-shrink-0">A</div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold">Prepare the Script</h4>
                      <p className="text-sm text-gray-500 font-light leading-relaxed">
                        Copy the code below and paste it into your Google Sheet's <strong>Extensions &gt; Apps Script</strong> editor.
                      </p>
                      <div className="relative group">
                        <pre className="bg-gray-900 text-gray-300 p-6 rounded-2xl text-xs overflow-x-auto font-mono max-h-64 border border-white/10">
                          {scriptCode}
                        </pre>
                        <button 
                          onClick={handleCopyCode}
                          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all text-white border border-white/20"
                        >
                          {copied ? <FiCheck /> : <FiCopy />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step B */}
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl font-bold flex-shrink-0">B</div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold">Deploy as Web App</h4>
                      <p className="text-sm text-gray-500 font-light leading-relaxed">
                        Click <strong>Deploy &gt; New Deployment</strong>. Choose <strong>Web App</strong>. 
                        Set "Who has access" to <strong>Anyone</strong>. This is vital for the app to talk to your sheet.
                      </p>
                    </div>
                  </div>

                  {/* Step C */}
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl font-bold flex-shrink-0">C</div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold">Paste the /exec URL</h4>
                      <p className="text-sm text-gray-500 font-light leading-relaxed">
                        Grab the generated URL (ends in <code>/exec</code>) and paste it into <strong>Settings &gt; Apps Script URL</strong>. 
                        Also, paste your sheet's browser URL into the <strong>Spreadsheet Link</strong> box.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Practices Section */}
            <section id="best-practices" className="space-y-6 pt-12">
              <div className="flex items-center gap-3 text-2xl font-bold font-heading">
                <FiShield className="text-[#A78BFA]" />
                <h3>Best Practices</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Always review the call-to-action (CTA) before sending.",
                  "Use the 'Saved to Logs' feature to track what works.",
                  "Avoid generic industry terms; use specific pain points.",
                  "Try 'Direct/Punchy' tone for high-level executives.",
                  "Keep your company value prop updated in settings.",
                  "Personalize the subject line even further if possible."
                ].map((tip, i) => (
                  <div key={i} className="flex gap-3 items-center p-4 bg-white/40 rounded-2xl border border-white/60">
                    <FiCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-light">{tip}</span>
                  </div>
                ))}
              </div>
            </section>

            <footer className="pt-24 text-center">
              <Link 
                to="/"
                className="liquid-button bg-white px-12 py-4 rounded-full font-semibold shadow-lg flex items-center gap-2 mx-auto inline-flex"
              >
                Ready to Start? Go to Workspace <FiArrowRight />
              </Link>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
