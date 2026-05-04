import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCopy, FiCheck, FiSave, FiLoader, FiExternalLink, FiAlertCircle } from 'react-icons/fi';

const COPY_FEEDBACK_DURATION_MS = 2000;

/**
 * Renders the generated message output card with copy and save actions.
 *
 * @param {Object} props
 * @param {string} props.message - The generated message text
 * @param {Function} props.onCopy - Callback triggered when copy is clicked
 * @param {Function} props.onSave - Callback triggered when save is clicked
 * @param {string|null} props.sheetStatus - Current save status ('saving'|'saved'|'error'|null)
 * @param {string} props.sheetUrl - URL to the Google Sheet
 * @returns {JSX.Element}
 */
export function OutputCard({ message, onCopy, onSave, sheetStatus, sheetUrl }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    onCopy();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), COPY_FEEDBACK_DURATION_MS);
  }, [onCopy]);

  return (
    <article className="glass-panel rounded-2xl p-8 mt-6 border border-white/60 shadow-sm">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 text-center">
        Your Personalised Message
      </h2>

      <p className="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap font-medium text-center">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-white/40">
        <motion.button
          type="button"
          onClick={handleCopy}
          aria-label={isCopied ? 'Message copied to clipboard' : 'Copy message to clipboard'}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-8 py-3 text-sm font-semibold font-subheading text-gray-800 hover:bg-white transition-all shadow-sm"
        >
          {isCopied ? (
            <FiCheck className="text-green-500" aria-hidden="true" />
          ) : (
            <FiCopy aria-hidden="true" />
          )}
          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
        </motion.button>

        <SaveButton
          onSave={onSave}
          sheetStatus={sheetStatus}
        />

        <motion.a
          href={sheetUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ x: 2 }}
          className="inline-flex items-center gap-1.5 text-xs font-bold font-subheading text-gray-700 hover:text-gray-900 underline underline-offset-4 transition-colors"
        >
          <span>View log</span>
          <FiExternalLink size={12} aria-hidden="true" />
        </motion.a>
      </div>

      <AnimatePresence>
        {sheetStatus === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="text-sm text-red-600 mt-6 text-center font-medium"
          >
            Could not save to Sheets. Your message is still available above.
          </motion.p>
        )}
      </AnimatePresence>
    </article>
  );
}

/**
 * Renders the save-to-sheets button with loading and success states.
 *
 * @param {Object} props
 * @param {Function} props.onSave - Callback triggered on click
 * @param {string|null} props.sheetStatus - Current save status
 * @returns {JSX.Element}
 */
function SaveButton({ onSave, sheetStatus }) {
  const isSaving = sheetStatus === 'saving';
  const isSaved = sheetStatus === 'saved';
  const isError = sheetStatus === 'error';

  return (
    <motion.button
      type="button"
      onClick={onSave}
      disabled={isSaving || isSaved}
      whileHover={!(isSaving || isSaved || isError) ? { y: -2, scale: 1.02 } : {}}
      whileTap={!(isSaving || isSaved || isError) ? { scale: 0.98 } : {}}
      className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold font-subheading transition-all shadow-sm min-w-[160px] justify-center ${
        isSaved
          ? 'bg-green-100 text-green-700 border border-green-200'
          : isError
          ? 'bg-red-100 text-red-700 border border-red-200'
          : 'bg-gradient-to-r from-[#E0D0F5] to-[#FCEEF9] text-gray-900 border border-white/60 hover:shadow-md disabled:opacity-70'
      }`}
    >
      {isSaving ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          aria-hidden="true"
        >
          <FiLoader />
        </motion.div>
      ) : isSaved ? (
        <FiCheck className="text-green-600" aria-hidden="true" />
      ) : isError ? (
        <FiAlertCircle aria-hidden="true" />
      ) : (
        <FiSave aria-hidden="true" />
      )}

      <span>
        {isSaving ? 'Saving...' : isSaved ? 'Saved ✓' : isError ? 'Retry' : 'Save to Sheets'}
      </span>
    </motion.button>
  );
}
