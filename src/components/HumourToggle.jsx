/**
 * Renders an accessible humour toggle switch.
 * Uses a checkbox input with a visible label linked via htmlFor.
 *
 * @param {Object} props
 * @param {boolean} props.humour - Whether humour mode is currently enabled
 * @param {Function} props.onToggle - Callback to toggle humour on/off
 * @returns {JSX.Element}
 */
import { motion, AnimatePresence } from 'framer-motion';

export function HumourToggle({ humour, onToggle }) {
  return (
    <motion.button
      id="humour-toggle"
      type="button"
      role="switch"
      aria-checked={humour}
      aria-label="Toggle witty hook"
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full rounded-full h-[52px] flex items-center justify-between px-2 transition-colors duration-500 overflow-hidden border ${
        humour
          ? 'border-white ring-2 ring-white/20'
          : 'glass-input border-white/60'
      }`}
    >
      {/* Background Animation */}
      <motion.div
        initial={false}
        animate={{
          x: humour ? '0%' : '-100%',
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="absolute inset-0 bg-gradient-to-r from-[#E9D9FA] to-[#F1C5F0] z-0"
      />

      {/* Handle */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 150, damping: 25 }}
        className={`relative z-20 w-10 h-10 rounded-full shadow-md flex items-center justify-center ${
          humour ? 'bg-white' : 'bg-white/80'
        }`}
        style={{
          marginLeft: humour ? 'auto' : '0',
          marginRight: humour ? '0' : 'auto',
        }}
      >
        <motion.div
          animate={{ rotate: humour ? 180 : 0 }}
          transition={{ duration: 0.8 }}
          className="text-gray-900"
        >
          {humour ? '✨' : '⚡️'}
        </motion.div>
      </motion.div>

      {/* Text Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <motion.span
          animate={{
            color: humour ? '#111827' : '#6B7280',
            opacity: 1,
          }}
          transition={{ duration: 0.8 }}
          className="text-xs font-bold font-subheading tracking-widest uppercase"
        >
          {humour ? 'Witty Hook: ON' : 'Witty Hook: OFF'}
        </motion.span>
      </div>
    </motion.button>
  );
}
