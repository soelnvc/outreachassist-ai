import { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarFooter } from './Footer.jsx';
import {
  FiLayout,
  FiClock,
  FiDatabase,
  FiBookOpen,
  FiSettings,
} from 'react-icons/fi';

/**
 * Renders the main navigation sidebar with route links and an external logs confirmation.
 *
 * @param {Object} props
 * @param {Object|null} props.userProfile - The logged-in user's profile data
 * @param {string} props.sheetUrl - Default Google Sheet URL
 * @returns {JSX.Element}
 */
export function Sidebar({ userProfile, sheetUrl }) {
  const location = useLocation();
  const [isShowingLogConfirm, setIsShowingLogConfirm] = useState(false);

  const navItems = [
    { path: '/', label: 'Workspace', icon: FiLayout },
    { path: '/history', label: 'History', icon: FiClock },
    {
      path: userProfile?.viewUrl || sheetUrl,
      label: 'Logs',
      icon: FiDatabase,
      isExternal: true,
    },
    { path: '/guide', label: 'How to Use', icon: FiBookOpen },
    { path: '/settings', label: 'Settings', icon: FiSettings },
  ];

  const handleLogClick = useCallback((e) => {
    e.preventDefault();
    setIsShowingLogConfirm(true);
  }, []);

  const proceedToLogs = useCallback(() => {
    const url = userProfile?.viewUrl || sheetUrl;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    setIsShowingLogConfirm(false);
  }, [userProfile, sheetUrl]);

  return (
    <>
      <aside className="w-64 bg-[#E0D0F5]/40 backdrop-blur-md border-r border-white/50 flex flex-col justify-between hidden lg:flex sticky top-0 h-screen shadow-lg">
        <div className="p-8">
          <h1 className="text-2xl font-bold font-heading tracking-tight leading-tight text-gray-900 text-center uppercase">
            OutreachAI <br /> Sales <br /> Copilot
          </h1>
          <p className="mt-4 text-[10px] text-center text-gray-600 leading-tight font-medium">
            AI-powered cold outreach <br /> for modern sales teams.
          </p>
        </div>

        <nav className="flex flex-col gap-2 px-6">
          {navItems.map((navItem) => {
            const Icon = navItem.icon;
            const isActive = location.pathname === navItem.path;

            if (navItem.isExternal) {
              return (
                <button
                  key={navItem.label}
                  onClick={handleLogClick}
                  disabled={navItem.path === '#'}
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group w-full text-left ${
                    navItem.path === '#' ? 'opacity-50 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={navItem.path === '#' ? 'Logs not configured in .env' : 'View logs in Google Sheets'}
                >
                  <Icon className="text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium tracking-wide nav-link-underline pb-0.5 group-hover:after:scale-x-100">
                    {navItem.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={navItem.path}
                to={navItem.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all relative group ${
                  isActive
                    ? 'text-[#2D1B69]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {/* Animated Active Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/60 shadow-sm border border-white/40 rounded-2xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <Icon
                  className={`text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-[#A78BFA]' : ''}`}
                />
                <span
                  className={`text-sm tracking-wide nav-link-underline pb-0.5 transition-all ${
                    isActive
                      ? 'font-bold after:scale-x-100'
                      : 'font-medium group-hover:after:scale-x-100'
                  }`}
                >
                  {navItem.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <SidebarFooter />
      </aside>

      {/* External Link Confirmation Modal */}
      <AnimatePresence>
        {isShowingLogConfirm && (
          <div className="fixed inset-0 z-[10000] bg-white/10 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 text-center border border-white shadow-2xl"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiDatabase className="text-4xl text-[#A78BFA]" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-gray-900 mb-2">
                Open Google Sheets?
              </h3>
              <p className="text-gray-600 font-light mb-8 leading-relaxed">
                You are about to leave OutreachAI to view your generation logs
                in Google Sheets.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={proceedToLogs}
                  className="liquid-button bg-[#A78BFA] text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-purple-200"
                >
                  <span className="relative z-10">Continue to Sheets</span>
                </button>
                <button
                  onClick={() => setIsShowingLogConfirm(false)}
                  className="px-8 py-3 rounded-full text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Stay Here
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
