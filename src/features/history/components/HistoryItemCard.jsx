import { motion, AnimatePresence } from 'framer-motion';
import { FiCopy, FiCheck, FiSave, FiLoader, FiExternalLink, FiAlertCircle, FiTrash2 } from 'react-icons/fi';

const INTENT_PREVIEW_MAX_LENGTH = 20;

/**
 * HistoryItemCard — renders a single history record with its metadata and action buttons.
 *
 * @param {Object} props
 * @param {Object} props.historyItem - The history record data
 * @param {number} props.index - Index in the list (for staggered animations)
 * @param {string|null} props.copiedId - The ID of the currently copied item (for feedback)
 * @param {Object} props.savingIds - Map of item IDs to their save status
 * @param {string|null} props.deletingId - The ID of the item currently in deletion confirmation
 * @param {Function} props.onCopy - Callback for copy action
 * @param {Function} props.onDeleteInit - Callback to start deletion confirmation
 * @param {Function} props.onDeleteCancel - Callback to cancel deletion
 * @param {Function} props.onDeleteConfirm - Callback to confirm deletion
 * @param {Function} props.onSave - Callback to save to logs
 * @param {string} props.viewLogUrl - URL to view the Google Sheet
 * @returns {JSX.Element}
 */
export function HistoryItemCard({
  historyItem,
  index,
  copiedId,
  savingIds,
  deletingId,
  onCopy,
  onDeleteInit,
  onDeleteCancel,
  onDeleteConfirm,
  onSave,
  viewLogUrl
}) {
  const isSaving = savingIds[historyItem.id] === 'saving';
  const isSaved = savingIds[historyItem.id] === 'saved';
  const isError = savingIds[historyItem.id] === 'error';
  const isCopied = copiedId === historyItem.id;
  const isConfirmingDelete = deletingId === historyItem.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass-panel rounded-3xl p-6 flex flex-col gap-4 border border-white/60 shadow-sm relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-2 border-b border-white/40 pb-4">
        <div>
          <h3 className="text-lg font-bold font-heading text-gray-900">
            {historyItem.formData.name || 'Unknown Prospect'}
          </h3>
          <p className="text-xs font-light text-gray-500 mt-1 uppercase tracking-wider">
            {historyItem.formData.buyerPersona || historyItem.formData.profession || 'Role Not Specified'}
            {(historyItem.formData.industry || historyItem.formData.country) ? ` • ${historyItem.formData.industry || historyItem.formData.country}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            {historyItem.createdAt ? new Date(historyItem.createdAt).toLocaleDateString() : 'Just now'}
          </span>
          <div className="flex items-center gap-2 border-l border-white/40 pl-3 ml-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onCopy(historyItem.id, historyItem.generatedMessage)}
              className={`transition-colors ${isCopied ? 'text-green-500' : 'text-gray-400 hover:text-gray-900'}`}
              title="Copy to clipboard"
            >
              {isCopied ? <FiCheck size={16} /> : <FiCopy size={16} />}
            </motion.button>
            <AnimatePresence mode="wait">
              {!isConfirmingDelete ? (
                <motion.button
                  key="del-init"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1, color: '#ef4444' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDeleteInit(historyItem.id)}
                  className="text-gray-400 transition-colors"
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </motion.button>
              ) : (
                <motion.div
                  key="del-confirm"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  className="flex items-center gap-2"
                >
                  <button
                    onClick={onDeleteCancel}
                    className="text-[10px] font-semibold text-gray-400 hover:text-gray-900 uppercase"
                  >
                    No
                  </button>
                  <button
                    onClick={() => onDeleteConfirm(historyItem.id)}
                    className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase underline underline-offset-2"
                  >
                    Yes
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {historyItem.formData.outreachChannel && (
          <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wide">
            📨 {historyItem.formData.outreachChannel}
          </span>
        )}
        {historyItem.formData.companySize && (
          <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wide">
            🏢 {historyItem.formData.companySize}
          </span>
        )}
        {historyItem.formData.tone && (
          <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wide">
            🎙 {historyItem.formData.tone}
          </span>
        )}
        {historyItem.formData.intent && (
          <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wide">
            🎯 {historyItem.formData.intent.substring(0, INTENT_PREVIEW_MAX_LENGTH)}
          </span>
        )}
        {historyItem.formData.humour && (
          <span className="px-3 py-1 bg-[#E9D9FA]/50 rounded-full text-[10px] font-bold text-gray-700 uppercase tracking-wide">
            ✨ Witty Hook
          </span>
        )}
      </div>

      <div className="bg-white/30 rounded-2xl p-4 mt-2 max-h-48 overflow-y-auto custom-scrollbar border border-white/20">
        <p className="text-sm font-light text-gray-800 whitespace-pre-wrap leading-relaxed">
          {historyItem.generatedMessage}
        </p>
      </div>

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/40">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSave(historyItem)}
          disabled={isSaving || isSaved}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold font-subheading transition-all ${
            isSaved
              ? 'bg-green-100 text-green-700 border border-green-200'
              : isError
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-white/40 text-gray-700 border border-white/60 hover:bg-white/60'
          }`}
        >
          {isSaving ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <FiLoader />
            </motion.div>
          ) : isSaved ? (
            <FiCheck />
          ) : isError ? (
            <FiAlertCircle />
          ) : (
            <FiSave />
          )}
          <span>
            {isSaving ? 'Saving...' :
             isSaved ? 'Saved' :
             isError ? 'Failed' : 'Save to Logs'}
          </span>
        </motion.button>

        <motion.a
          href={viewLogUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ x: 2 }}
          className="text-[10px] font-bold text-gray-400 hover:text-gray-800 flex items-center gap-1 uppercase"
        >
          View Log <FiExternalLink size={10} />
        </motion.a>
      </div>
    </motion.div>
  );
}
