import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarFooter } from './Footer.jsx';
import { 
  FiLayout, 
  FiClock, 
  FiDatabase, 
  FiBookOpen, 
  FiSettings 
} from 'react-icons/fi';

export function Sidebar({ userProfile, sheetUrl }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Workspace', icon: FiLayout },
    { path: '/history', label: 'History', icon: FiClock },
    { 
      path: userProfile?.viewUrl || sheetUrl, 
      label: 'Logs', 
      icon: FiDatabase,
      isExternal: true 
    },
    { path: '/guide', label: 'How to Use', icon: FiBookOpen },
    { path: '/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
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
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          if (item.isExternal) {
            return (
              <a 
                key={item.label}
                href={item.path}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-600 hover:text-gray-900 transition-all group"
              >
                <Icon className="text-lg group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium tracking-wide nav-link-underline pb-0.5 group-hover:after:scale-x-100">{item.label}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all relative group ${
                isActive ? 'text-[#2D1B69]' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {/* Animated Active Background */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-white/60 shadow-sm border border-white/40 rounded-2xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <Icon className={`text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-[#A78BFA]' : ''}`} />
              <span className={`text-sm tracking-wide nav-link-underline pb-0.5 transition-all ${
                isActive 
                  ? 'font-bold after:scale-x-100' 
                  : 'font-medium group-hover:after:scale-x-100'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <SidebarFooter />
    </aside>
  );
}
