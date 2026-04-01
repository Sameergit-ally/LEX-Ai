import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Documents', path: '/document-analyzer' },
  { name: 'Your Rights', path: '/know-your-rights' },
  { name: 'Drafts', path: '/draft-generator' },
  { name: 'Case Tracker', path: '/case-tracker' },
  { name: 'Case Rescue', path: '/case-rescue', highlight: true },
];

const ScalesIcon = () => (
  <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 12 L50 72" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
    <path d="M28 30 L72 30" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
    <path d="M28 30 L18 52 A14 7 0 0 0 38 52 Z" stroke="#f59e0b" strokeWidth="2.5" fill="rgba(245,158,11,0.15)" />
    <path d="M72 30 L62 52 A14 7 0 0 0 82 52 Z" stroke="#f59e0b" strokeWidth="2.5" fill="rgba(245,158,11,0.15)" />
    <path d="M36 72 L64 72" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-[rgba(10,10,15,0.9)] backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-[rgba(245,158,11,0.15)]'
          : 'bg-[rgba(10,10,15,0.6)] backdrop-blur-xl border-b border-[rgba(245,158,11,0.08)]'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="transition-transform duration-300 group-hover:scale-110">
              <ScalesIcon />
            </div>
            <span
              className="text-xl font-bold text-amber-400"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Lex AI
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group
                    ${link.highlight
                      ? isActive
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/5'
                      : isActive
                        ? 'text-white bg-white/[0.08]'
                        : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                  {link.highlight && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                  )}
                  {link.name}
                  {/* Gold underline on hover */}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-amber-500 rounded-full transition-all duration-300
                    ${isActive ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`}
                  />
                </Link>
              );
            })}
          </div>

          {/* CTA + Mobile button */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden lg:inline-flex px-5 py-2 rounded-full text-sm font-bold
                bg-gradient-to-r from-amber-500 to-amber-600 text-black
                hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]
                transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              Get Started
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 w-72 h-full z-50 lg:hidden
                bg-[#0f1420]/95 backdrop-blur-2xl border-l border-[rgba(245,158,11,0.15)]
                p-6 pt-20"
            >
              <button
                className="absolute top-5 right-5 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <HiX className="w-6 h-6" />
              </button>

              <div className="space-y-1">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                          ${isActive
                            ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                            : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.04]'
                          }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-5 py-3 rounded-xl text-sm font-bold
                    bg-gradient-to-r from-amber-500 to-amber-600 text-black
                    hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
