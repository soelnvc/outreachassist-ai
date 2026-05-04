import { motion } from 'framer-motion';
import { FiUser, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

/**
 * ProfileForm — handles user profile information including name, title, company, and bio.
 *
 * @param {Object} props
 * @param {Object} props.profile - Current profile data
 * @param {Function} props.onFieldChange - Callback to update a profile field
 * @param {Function} props.onSave - Callback to trigger save
 * @param {boolean} props.isSaving - Loading state for save action
 * @param {string|null} props.saveStatus - Success/error status of last save
 * @param {string} props.userEmail - Logged in user's email
 * @param {Object} props.itemVariants - Framer motion variants for the section
 * @returns {JSX.Element}
 */
export function ProfileForm({
  profile,
  onFieldChange,
  onSave,
  isSaving,
  saveStatus,
  userEmail,
  itemVariants
}) {
  return (
    <motion.section variants={itemVariants} className="glass-panel rounded-3xl p-8 border border-white/60 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <FiUser className="text-2xl text-[#A78BFA]" />
        <h3 className="text-xl font-bold font-heading text-gray-900">Your Profile</h3>
      </div>
      <p className="text-sm font-light text-gray-600 mb-8">
        This information helps the AI craft messages on your behalf. It will establish your credibility and position your outreach naturally.
      </p>

      <form onSubmit={onSave} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-medium font-subheading text-[#2D1B69] uppercase tracking-widest pl-4"> Your Name </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              placeholder="e.g. Sarah Mitchell"
              className="w-full rounded-2xl px-6 py-3 font-light font-subheading text-gray-800 placeholder-gray-400 glass-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-medium font-subheading text-[#2D1B69] uppercase tracking-widest pl-4">Account Email</label>
            <input
              type="email"
              value={userEmail}
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
              onChange={(e) => onFieldChange('work', e.target.value)}
              placeholder="e.g. SDR at Acme Corp"
              className="w-full rounded-2xl px-6 py-3 font-light font-subheading text-gray-800 placeholder-gray-400 glass-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-medium font-subheading text-[#2D1B69] uppercase tracking-widest pl-4">Company Name</label>
            <input
              type="text"
              value={profile.company || ''}
              onChange={(e) => onFieldChange('company', e.target.value)}
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
            onChange={(e) => onFieldChange('about', e.target.value)}
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
            disabled={isSaving}
            className="liquid-button bg-white/40 border border-white/60 shadow-sm text-sm font-semibold font-subheading px-10 py-3 rounded-full transition-all z-0 disabled:opacity-50"
          >
            <span className="relative z-10">{isSaving ? 'Saving...' : 'Update Profile'}</span>
          </button>
        </div>
      </form>
    </motion.section>
  );
}
