import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getUserProfile, saveUserProfile } from '../services/userProfile.js';
import { FiAlertTriangle, FiCheck, FiX, FiShield } from 'react-icons/fi';

export function TOSGuard({ children }) {
  const { currentUser } = useAuth();
  const [hasAccepted, setHasAccepted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showRejection, setShowRejection] = useState(false);

  useEffect(() => {
    async function checkTOS() {
      try {
        if (currentUser) {
          const profile = await getUserProfile(currentUser.uid);
          if (profile && profile.acceptedTOS) {
            setHasAccepted(true);
          } else {
            setHasAccepted(false);
          }
        } else {
          setHasAccepted(true); // Don't block guests
        }
      } catch (error) {
        console.error("TOS Check error:", error);
        setHasAccepted(true); // Default to accepted on error to avoid lockout
      } finally {
        setLoading(false);
      }
    }
    checkTOS();
  }, [currentUser]);

  const handleAccept = async () => {
    if (!currentUser) return;
    try {
      await saveUserProfile(currentUser.uid, { acceptedTOS: true });
      setHasAccepted(true);
    } catch (error) {
      console.error("Failed to save TOS acceptance", error);
    }
  };

  const handleReject = () => {
    setShowRejection(true);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#EAE6F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#A78BFA]/30 border-t-[#A78BFA] rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500 animate-pulse">Launching OutreachAI...</p>
        </div>
      </div>
    );
  }

  if (showRejection) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#EAE6F5] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-panel rounded-3xl p-10 text-center border-red-200 shadow-2xl"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertTriangle className="text-4xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600 font-light mb-8 leading-relaxed">
            To ensure the safe and ethical use of AI, all users must agree to our Terms of Service before accessing OutreachAI. 
            <br /><br />
            Please accept the terms to unlock your workspace.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setShowRejection(false)}
              className="liquid-button bg-[#A78BFA] text-white px-8 py-3 rounded-full font-semibold"
            >
              Back to Terms
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {!hasAccepted && currentUser && (
          <div className="fixed inset-0 z-[9000] bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="max-w-2xl w-full glass-panel rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/40 bg-white/20 flex items-center gap-3">
                <FiShield className="text-2xl text-[#A78BFA]" />
                <h2 className="text-xl font-bold font-heading">Terms of Service Agreement</h2>
              </div>
              
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                <p className="text-gray-700 font-medium italic">Before we start, please review our AI safety guidelines:</p>
                
                <section className="space-y-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <FiCheck className="text-green-500" /> AI Responsibility
                  </h4>
                  <p className="text-sm text-gray-600 font-light">
                    You are responsible for reviewing and fact-checking all AI-generated messages. AI can occasionally provide incorrect information.
                  </p>
                </section>

                <section className="space-y-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <FiCheck className="text-green-500" /> Data Privacy
                  </h4>
                  <p className="text-sm text-gray-600 font-light">
                    Your outreach logs are stored in your own Google Sheet. We do not sell your prospect data to third parties.
                  </p>
                </section>

                <section className="space-y-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <FiCheck className="text-green-500" /> Usage Policy
                  </h4>
                  <p className="text-sm text-gray-600 font-light">
                    You agree not to use OutreachAI for illegal spamming or prohibited solicitations.
                  </p>
                </section>
              </div>

              <div className="p-8 bg-white/30 border-t border-white/40 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-[11px] text-gray-500 text-center sm:text-left max-w-[280px]">
                  By clicking Accept, you agree to our full <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
                </p>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button 
                    onClick={handleReject}
                    className="flex-1 sm:flex-none px-8 py-3 rounded-full text-sm font-semibold text-gray-500 border border-white/60 hover:bg-white/40 transition-all"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={handleAccept}
                    className="flex-1 sm:flex-none liquid-button bg-[#A78BFA] text-white px-10 py-3 rounded-full font-semibold shadow-lg"
                  >
                    Accept Terms
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
