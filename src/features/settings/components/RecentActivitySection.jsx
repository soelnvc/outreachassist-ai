import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClock, FiChevronRight, FiMessageSquare } from 'react-icons/fi';

/**
 * RecentActivitySection — displays a preview of the last few generations.
 *
 * @param {Object} props
 * @param {Array} props.history - List of recent history items
 * @param {number} props.limit - The number of items to mention in text
 * @param {Object} props.itemVariants - Framer motion variants
 * @returns {JSX.Element}
 */
export function RecentActivitySection({
  history,
  limit,
  itemVariants
}) {
  return (
    <motion.section variants={itemVariants} className="glass-panel rounded-3xl p-8 border border-white/60 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiClock className="text-2xl text-[#A78BFA]" />
          <h3 className="text-xl font-bold font-heading text-gray-900">Recent Activity</h3>
        </div>
        <Link to="/history" className="text-sm font-bold text-[#A78BFA] hover:underline flex items-center gap-1">
          View All History <FiChevronRight />
        </Link>
      </div>
      <p className="text-sm font-light text-gray-600 mb-6">
        Your last {limit} generations are shown below for quick reference.
      </p>
      <div className="flex flex-col gap-3">
        {history.length > 0 ? (
          history.map((historyItem) => (
            <Link
              key={historyItem.id}
              to="/history"
              className="flex items-center justify-between p-4 bg-white/30 rounded-2xl border border-white/40 hover:bg-white/50 transition-all group"
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-10 h-10 bg-[#E0D0F5]/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiMessageSquare className="text-[#A78BFA]" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <h4 className="font-bold text-gray-800 truncate text-sm">
                    {historyItem.formData?.name || 'Unknown Prospect'}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-light truncate">
                    {historyItem.generatedMessage?.substring(0, 60)}...
                  </p>
                </div>
              </div>
              <FiChevronRight className="text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
            </Link>
          ))
        ) : (
          <div className="bg-white/20 rounded-2xl p-6 border border-white/40 text-center italic text-gray-500 font-light">
            No recent activity found. Start generating in the workspace!
          </div>
        )}
      </div>
    </motion.section>
  );
}
