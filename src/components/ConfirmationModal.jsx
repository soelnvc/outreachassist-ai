import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiLogOut } from 'react-icons/fi';

/**
 * A premium, glass-morphic confirmation modal.
 * 
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Function to call when closing without action
 * @param {Function} onConfirm - Function to call when user confirms
 * @param {string} title - Modal title
 * @param {string} message - Modal description
 * @param {string} confirmText - Label for the action button
 * @param {string} confirmColor - Tailwind color class for the action button
 * @param {React.ReactNode} icon - Icon to display at the top
 */
export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message, 
  confirmText = "Confirm", 
  confirmColor = "bg-[#A78BFA]",
  icon = <FiAlertCircle className="text-4xl text-[#A78BFA]" />
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] bg-white/10 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 text-center border border-white shadow-2xl"
          >
            <div className="w-20 h-20 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 bg-gray-100">
              {icon}
            </div>
            <h3 className="text-2xl font-bold font-heading text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 font-light mb-8 leading-relaxed">
              {message}
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={onConfirm}
                className={`liquid-button ${confirmColor} text-white px-8 py-3 rounded-full font-semibold shadow-lg`}
              >
                <span className="relative z-10">{confirmText}</span>
              </button>
              <button 
                onClick={onClose}
                className="px-8 py-3 rounded-full text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
