import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShield, FiLock, FiEye, FiServer, FiArrowLeft } from 'react-icons/fi';
import { SidebarFooter } from '../../components/Footer.jsx';

export function PrivacyPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#EAE6F5] via-[#F4F0FB] to-[#FCEEF9] font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#E0D0F5]/40 backdrop-blur-md border-r border-white/50 flex flex-col justify-between hidden lg:flex sticky top-0 h-screen shadow-lg">
        <div className="p-8">
          <h1 className="text-2xl font-bold font-heading tracking-tight leading-tight text-gray-900 text-center uppercase">
            OutreachAI <br /> Sales <br /> Copilot
          </h1>
        </div>

        <nav className="flex flex-col gap-10 items-center font-light font-subheading text-gray-700 text-base">
          <Link to="/" className="nav-link-underline pb-1 transition-colors">Workspace</Link>
          <Link to="/history" className="nav-link-underline pb-1 transition-colors">History</Link>
          <Link to="/guide" className="nav-link-underline pb-1 transition-colors">How to Use</Link>
          <Link to="/settings" className="nav-link-underline pb-1 transition-colors">Settings</Link>
        </nav>

        <SidebarFooter />
      </aside>

      <main className="flex-1 p-8 md:p-16 h-screen overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          <header className="mb-12">
            <Link to="/settings" className="inline-flex items-center gap-2 text-sm font-semibold text-[#A78BFA] hover:underline mb-8">
              <FiArrowLeft /> Back to Settings
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-4xl font-bold font-heading tracking-tight">Privacy Policy</h2>
              <p className="text-gray-500 mt-4 font-light">Last Updated: May 2026</p>
            </motion.div>
          </header>

          <article className="glass-panel rounded-3xl p-8 md:p-12 border border-white/60 space-y-12">
            
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-xl font-bold font-heading text-gray-900">
                <FiShield className="text-[#A78BFA]" />
                <h3>Our Commitment</h3>
              </div>
              <p className="text-gray-600 font-light leading-relaxed">
                At OutreachAI, we believe your sales strategy is your most valuable asset. Our privacy philosophy is simple: <strong>We do not own your data.</strong> Our platform is architected to ensure that your prospect information and generated messages remain under your control.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-xl font-bold font-heading text-gray-900">
                <FiServer className="text-[#A78BFA]" />
                <h3>Data Storage & Ownership</h3>
              </div>
              <p className="text-gray-600 font-light leading-relaxed">
                We use a "Bring Your Own Storage" model. When you link your Google Sheets, the data flows directly from your browser to your Google Apps Script. 
                <br /><br />
                - <strong>OutreachAI Servers</strong>: We do not store your Google Sheet data on our servers.
                <br />
                - <strong>Persistence</strong>: We only store your profile settings and a 30-day history of generations to allow you to access them across devices.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-xl font-bold font-heading text-gray-900">
                <FiEye className="text-[#A78BFA]" />
                <h3>AI Processing</h3>
              </div>
              <p className="text-gray-600 font-light leading-relaxed">
                Your prompts are processed using the Google Gemini Pro API. 
                According to Google's Enterprise privacy standards, data sent via the API is <strong>not</strong> used to train their global foundational models. Your specific sales hooks and value propositions remain confidential to your account.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-xl font-bold font-heading text-gray-900">
                <FiLock className="text-[#A78BFA]" />
                <h3>Security Measures</h3>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
                <li>End-to-end encryption for all data in transit.</li>
                <li>Firebase Authentication for secure, multi-factor account access.</li>
                <li>No third-party tracking or data selling. Ever.</li>
              </ul>
            </section>

            <div className="pt-8 border-t border-white/40">
              <p className="text-sm text-gray-400 font-light italic">
                Questions about your data? Contact our privacy team at privacy@outreachai.com
              </p>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
