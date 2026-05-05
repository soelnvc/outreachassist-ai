import { motion } from 'framer-motion';
import { FiLink } from 'react-icons/fi';

/**
 * IntegrationSection — handles Google Sheets integration settings.
 *
 * @param {Object} props
 * @param {Object} props.profile - Current profile data containing integration URLs
 * @param {Function} props.onFieldChange - Callback to update a field
 * @param {Function} props.onSave - Callback to trigger save
 * @param {boolean} props.isSaving - Loading state
 * @param {Object} props.itemVariants - Framer motion variants
 * @returns {JSX.Element}
 */
export function IntegrationSection({
  profile,
  onFieldChange,
  onSave,
  isSaving,
  itemVariants
}) {
  return (
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
            value={profile.viewUrl || ''}
            onChange={(e) => onFieldChange('viewUrl', e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className="w-full rounded-2xl px-6 py-3 font-light font-subheading text-gray-800 placeholder-gray-400 glass-input"
          />
          <p className="text-[10px] text-gray-500 mt-1 pl-4">
            The &quot;Logs&quot; button in the sidebar will open this link.
          </p>
        </div>

        {/* Part 2: Apps Script Bridge */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-medium font-subheading text-[#2D1B69] uppercase tracking-widest pl-4">2. Apps Script Bridge (To Save Data)</label>
          <input
            type="text"
            value={profile.sheetsUrl || ''}
            onChange={(e) => onFieldChange('sheetsUrl', e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full rounded-2xl px-6 py-3 font-light font-subheading text-gray-800 placeholder-gray-400 glass-input"
          />
          <p className="text-[10px] text-gray-500 mt-1 pl-4">
            The &quot;Save&quot; button uses this to send data to your sheet. Use the URL ending in <strong>/exec</strong>.
          </p>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-white/40">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="liquid-button bg-white/40 border border-white/60 shadow-sm text-sm font-semibold font-subheading px-10 py-3 rounded-full transition-all z-0 disabled:opacity-50"
          >
            <span className="relative z-10">{isSaving ? 'Saving...' : 'Save Integration'}</span>
          </button>
        </div>
      </div>
    </motion.section>
  );
}
