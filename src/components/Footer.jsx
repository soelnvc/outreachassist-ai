/**
 * Renders a professional product footer for the sidebar.
 * Includes copyright and legal links in small, thin grey text.
 */
export function SidebarFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="p-8 border-t border-gray-900/10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-light text-gray-500 uppercase tracking-widest">
            © {currentYear} OutreachAI
          </p>
          <p className="text-[10px] text-gray-400 font-extralight">
            Empowering human-first communication.
          </p>
        </div>
        
        <nav className="flex flex-col gap-2">
          <a href="#" className="text-[10px] text-gray-500 hover:text-indigo-600 transition-colors font-medium underline underline-offset-2 decoration-gray-300">
            Privacy Policy
          </a>
          <a href="#" className="text-[10px] text-gray-500 hover:text-indigo-600 transition-colors font-medium underline underline-offset-2 decoration-gray-300">
            Terms of Service
          </a>
          <a href="#" className="text-[10px] text-gray-500 hover:text-indigo-600 transition-colors font-medium underline underline-offset-2 decoration-gray-300">
            Contact Support
          </a>
        </nav>
      </div>
    </footer>
  );
}

/**
 * Renders the AI caution statement.
 */
export function AIDisclaimer() {
  return (
    <p className="mt-8 text-[11px] text-gray-400 font-light text-center leading-relaxed max-w-md mx-auto">
      OutreachAI uses advanced language models to generate suggestions. 
      <span className="font-medium text-gray-500"> AI can make mistakes.</span> Please review all generated 
      messages for accuracy and tone before sending.
    </p>
  );
}
