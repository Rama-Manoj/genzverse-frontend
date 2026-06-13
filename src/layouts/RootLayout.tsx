import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { MobileNavigation } from '../components/common/MobileNavigation';
import { MobileBottomNav } from '../components/common/MobileBottomNav';
import { Footer } from '../components/common/Footer';

export const RootLayout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div 
      data-pathname={location.pathname}
      className="root-layout-wrapper h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 font-sans overflow-hidden flex flex-col relative"
    >
      
      {/* Floating neon background glow blobs for Gen Z vibe */}
      <div className="absolute top-1/4 left-[10%] w-[400px] h-[400px] bg-purple-600/15 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow -z-10" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-1/4 right-[10%] w-[400px] h-[400px] bg-pink-500/15 dark:bg-pink-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow -z-10" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[60%] w-[350px] h-[350px] bg-cyan-500/15 dark:bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow -z-10" style={{ animationDelay: '4s' }} />

      {/* Fixed Navbar — always on top */}
      <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Mobile Drawer Slide Navigation */}
      <MobileNavigation 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Push content below the fixed 64px navbar — fills available space */}
      <div className="pt-16 flex flex-1 w-full overflow-hidden">
        
        {/* Left Sidebar — sticks below navbar */}
        <Sidebar />

        {/* Main scrollable content */}
        <main ref={mainRef} className="flex flex-col flex-1 min-w-0 overflow-y-auto overflow-x-hidden scrollbar-none">
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
            >
              <Outlet />
            </motion.div>
          </div>
          {/* Footer — scrolls at the bottom of the content */}
          <Footer />
        </main>
      </div>

      {/* Mobile Bottom Navigation — only on mobile, above footer */}
      <MobileBottomNav />

    </div>
  );
};
export default RootLayout;
