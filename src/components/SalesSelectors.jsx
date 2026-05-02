import { motion } from 'framer-motion';

export const COMPANY_SIZE_OPTIONS = ['1-10', '11-50', '51-200', '201-1000', '1000+'];
export const OUTREACH_CHANNEL_OPTIONS = ['LinkedIn', 'Cold Email', 'Twitter/X', 'Follow-up'];
export const TONE_OPTIONS = ['Professional', 'Consultative', 'Direct/Punchy', 'Enthusiastic'];
export const INDUSTRY_OPTIONS = [
  'SaaS / Tech',
  'Agency / Services',
  'Healthcare',
  'Finance',
  'E-commerce',
  'Other',
];
export const BUYER_PERSONA_OPTIONS = [
  'Founder/CEO',
  'VP/Director',
  'Sales Leader',
  'HR/People',
  'Engineering/IT',
  'Marketing',
  'Other',
];

/**
 * Renders an accessible chip group as radio inputs styled as chips.
 * Each option is a visually hidden radio input with a visible label.
 */
export function ChipGroup({ label, name, options, selected, onChange, optional = false }) {
  const legendId = `${name}-label`;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <div id={legendId} className="text-sm font-light font-subheading text-gray-800 text-center uppercase tracking-wider">
        {label}
      </div>
      <div role="group" aria-labelledby={legendId} className="flex flex-wrap justify-center gap-2">
        {options.map((option) => (
          <motion.label
            key={option}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-light font-subheading cursor-pointer border transition-colors duration-500 ${
              selected === option
                ? 'bg-gradient-to-r from-[#E9D9FA] to-[#F1C5F0] text-gray-900 border-white shadow-sm ring-1 ring-white/20'
                : 'bg-white/40 text-gray-700 border-white/60 hover:bg-white/60'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={selected === option}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            <motion.span
              animate={{
                fontWeight: selected === option ? 600 : 300,
              }}
              transition={{ duration: 0.5 }}
            >
              {option}
            </motion.span>
          </motion.label>
        ))}
      </div>
    </div>
  );
}
