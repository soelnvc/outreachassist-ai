import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiLink, FiExternalLink, FiChevronRight } from 'react-icons/fi';

/**
 * ResourcesSection — displays useful links, support email, and legal docs.
 *
 * @param {Object} props
 * @param {string} props.sheetUrl - Base Google Sheet URL
 * @param {Object} props.itemVariants - Framer motion variants
 * @returns {JSX.Element}
 */
export function ResourcesSection({
  sheetUrl,
  itemVariants
}) {
  return (
    <motion.section variants={itemVariants} className="glass-panel rounded-3xl p-8 border border-white/60 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <FiLink className="text-2xl text-[#A78BFA]" />
        <h3 className="text-xl font-bold font-heading text-gray-900">Resources & Support</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.a
          href={sheetUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.5)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-between p-4 bg-white/30 rounded-2xl border border-white/40 transition-colors group"
        >
          <div>
            <h4 className="font-bold text-gray-800">System Logs</h4>
            <p className="text-xs text-gray-500">Google Sheets data log</p>
          </div>
          <FiExternalLink className="text-gray-400 group-hover:text-gray-900 transition-colors" />
        </motion.a>

        <motion.a
          href="mailto:soelnvc@gmail.com?subject=Technical Support: OutreachAI"
          whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.5)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-between p-4 bg-white/30 rounded-2xl border border-white/40 transition-colors group"
        >
          <div>
            <h4 className="font-bold text-gray-800">Contact Support</h4>
            <p className="text-xs text-gray-500">Get technical help</p>
          </div>
          <FiChevronRight className="text-gray-400 group-hover:text-gray-900 transition-colors" />
        </motion.a>

        <Link
          to="/guide"
          className="flex items-center justify-between p-4 bg-white/30 rounded-2xl border border-white/40 transition-all hover:bg-white/50 hover:-translate-y-1 shadow-sm hover:shadow-md group"
        >
          <div>
            <h4 className="font-bold text-gray-800">Documentation</h4>
            <p className="text-xs text-gray-500">How to use OutreachAI</p>
          </div>
          <FiChevronRight className="text-gray-400 group-hover:text-gray-900 transition-colors" />
        </Link>

        <Link
          to="/privacy"
          className="flex items-center justify-between p-4 bg-white/30 rounded-2xl border border-white/40 transition-all hover:bg-white/50 hover:-translate-y-1 shadow-sm hover:shadow-md group"
        >
          <div>
            <h4 className="font-bold text-gray-800">Privacy Policy</h4>
            <p className="text-xs text-gray-500">How we handle your data</p>
          </div>
          <FiChevronRight className="text-gray-400 group-hover:text-gray-900 transition-colors" />
        </Link>
      </div>
    </motion.section>
  );
}
