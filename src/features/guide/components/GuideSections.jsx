import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen, FiUser, FiLayout, FiDatabase, FiCheckCircle, FiCopy, FiArrowRight, FiZap, FiShield } from 'react-icons/fi';

/**
 * OverviewSection — brief introduction to the product.
 */
export function OverviewSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12"
    >
      <div className="space-y-4">
        <h3 className="text-3xl font-bold font-heading text-gray-900 flex items-center gap-3">
          <FiBookOpen className="text-[#A78BFA]" /> Overview
        </h3>
        <p className="text-lg text-gray-600 font-light leading-relaxed">
          OutreachAI is your Sales Copilot designed to bridge the gap between "automated spam" and "manual research." We use Gemini Pro to analyze prospect data and generate highly relevant sales hooks that feel human and researched.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <FiZap />, title: "Instant Personalization", desc: "No more spending 15 minutes researching one LinkedIn profile." },
          { icon: <FiUser />, title: "Human-First Tone", desc: "Crafted to sound like a colleague, not a marketing template." },
          { icon: <FiShield />, title: "Privacy Optimized", desc: "We don't store your sensitive prospect data on our servers." }
        ].map((feat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-white/60">
            <div className="w-10 h-10 bg-[#E0D0F5]/50 rounded-xl flex items-center justify-center text-[#A78BFA] mb-4">
              {feat.icon}
            </div>
            <h4 className="font-bold text-gray-900 mb-2">{feat.title}</h4>
            <p className="text-sm text-gray-500 font-light leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

/**
 * ProfileSetupSection — explaining how user profiles help the AI.
 */
export function ProfileSetupSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <h3 className="text-3xl font-bold font-heading text-gray-900 flex items-center gap-3">
        <FiUser className="text-[#A78BFA]" /> Profile Setup
      </h3>
      <div className="glass-panel p-8 rounded-[2rem] border border-white/60 space-y-6">
        <p className="text-gray-600 font-light leading-relaxed">
          Your profile is the <span className="font-bold text-gray-900">"Seller Context"</span>. The AI needs to know who you are and what you're offering to make the outreach make sense.
        </p>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-[#A78BFA] text-white flex items-center justify-center text-xs flex-shrink-0 mt-1">1</div>
            <div>
              <h4 className="font-bold text-gray-900">Value Proposition</h4>
              <p className="text-sm text-gray-500 font-light italic">"We help B2B SaaS companies reduce churn by 40%..."</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-[#A78BFA] text-white flex items-center justify-center text-xs flex-shrink-0 mt-1">2</div>
            <div>
              <h4 className="font-bold text-gray-900">Personal Tone</h4>
              <p className="text-sm text-gray-500 font-light">Set your role and company so the AI can sign off correctly.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/**
 * WorkspaceSection — how to use the generator.
 */
export function WorkspaceSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <h3 className="text-3xl font-bold font-heading text-gray-900 flex items-center gap-3">
        <FiLayout className="text-[#A78BFA]" /> Using the Workspace
      </h3>
      <div className="space-y-6">
        <div className="bg-[#E0D0F5]/20 p-6 rounded-2xl border border-[#A78BFA]/20">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FiCheckCircle className="text-green-500" /> The Secret Sauce: Prospect Snippets
          </h4>
          <p className="text-sm text-gray-600 font-light leading-relaxed">
            Instead of just a name, paste a "Snippet" from the prospect's LinkedIn About section or a recent post. The AI uses this to find a unique connection point that generic tools miss.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border border-dashed border-gray-300 rounded-2xl">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Step 1</span>
            <p className="text-sm text-gray-700 mt-2 font-medium">Select Industry & Tone</p>
          </div>
          <div className="p-6 border border-dashed border-gray-300 rounded-2xl">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Step 2</span>
            <p className="text-sm text-gray-700 mt-2 font-medium">Paste Prospect Snippet</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/**
 * SheetsSection — explaining Google Sheets integration and script setup.
 */
export function SheetsSection({ scriptCode, isCopied, onCopy }) {
  return (
    <motion.section 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <h3 className="text-3xl font-bold font-heading text-gray-900 flex items-center gap-3">
        <FiDatabase className="text-[#A78BFA]" /> Google Sheets Integration
      </h3>
      
      <div className="space-y-6">
        <p className="text-gray-600 font-light leading-relaxed">
          Log every generation automatically to your own Google Sheet. We don't store your logs; you own them.
        </p>

        <div className="space-y-12">
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-[#A78BFA] border border-[#E0D0F5]">1</div>
              <div className="w-px h-full bg-gradient-to-b from-[#E0D0F5] to-transparent mt-2"></div>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900">Create a Sheet</h4>
              <p className="text-sm text-gray-500 font-light">Create a new Google Sheet and name the first tab <span className="font-mono text-[10px] bg-gray-100 px-1 rounded text-gray-700">Sheet1</span>.</p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-[#A78BFA] border border-[#E0D0F5]">2</div>
              <div className="w-px h-full bg-gradient-to-b from-[#E0D0F5] to-transparent mt-2"></div>
            </div>
            <div className="flex-1 space-y-4">
              <h4 className="font-bold text-gray-900">Add Apps Script</h4>
              <p className="text-sm text-gray-500 font-light">Go to <span className="font-bold text-gray-700">Extensions {">"} Apps Script</span> and paste the following code:</p>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#A78BFA] to-[#F1C5F0] rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-[#1E1E2E] rounded-2xl p-6 overflow-x-auto shadow-xl border border-white/10">
                  <pre className="text-xs font-mono text-[#D1D1E0] leading-relaxed">
                    {scriptCode}
                  </pre>
                  <button 
                    onClick={onCopy}
                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all text-white border border-white/20"
                  >
                    {isCopied ? <FiCheckCircle /> : <FiCopy />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-[#A78BFA] border border-[#E0D0F5]">3</div>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900">Deploy as Web App</h4>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                Click <span className="font-bold text-gray-700">Deploy {">"} New Deployment</span>. 
                <br />Select <span className="font-bold text-gray-700">Web App</span>. 
                <br />Set "Who has access" to <span className="font-bold text-red-500 underline decoration-red-200">Anyone</span>.
                <br />Copy the Web App URL and paste it into <Link to="/settings" className="text-[#A78BFA] underline">Settings</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/**
 * BestPracticesSection — tips for high-quality outreach.
 */
export function BestPracticesSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <h3 className="text-3xl font-bold font-heading text-gray-900 flex items-center gap-3">
        <FiShield className="text-[#A78BFA]" /> Best Practices
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-green-400 bg-white/40">
          <h4 className="font-bold text-gray-900 text-sm mb-2">DO: Personalize the Subject</h4>
          <p className="text-xs text-gray-500 font-light">The AI generates the body, but make sure your subject line references a specific mutual interest.</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-red-400 bg-white/40">
          <h4 className="font-bold text-gray-900 text-sm mb-2">DON'T: Send Unedited</h4>
          <p className="text-xs text-gray-500 font-light">Always proofread. AI might hallucinate a fact about a company. Keep the "Human" in the loop.</p>
        </div>
      </div>
    </motion.section>
  );
}
