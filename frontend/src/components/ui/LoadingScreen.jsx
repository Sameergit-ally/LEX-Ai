import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1200);
    const removeTimer = setTimeout(() => setVisible(false), 1700);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0f]"
        >
          {/* Animated scales SVG */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-8"
          >
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M50 10 L50 75"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
              <motion.path
                d="M25 30 L75 30"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeInOut' }}
              />
              <motion.path
                d="M25 30 L15 55 A15 8 0 0 0 35 55 Z"
                stroke="#f59e0b"
                strokeWidth="2"
                fill="rgba(245,158,11,0.1)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6, ease: 'easeInOut' }}
              />
              <motion.path
                d="M75 30 L65 55 A15 8 0 0 0 85 55 Z"
                stroke="#f59e0b"
                strokeWidth="2"
                fill="rgba(245,158,11,0.1)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6, ease: 'easeInOut' }}
              />
              <motion.path
                d="M35 75 L65 75"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.9, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>

          {/* Text */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl font-bold text-amber-400 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Lex AI
          </motion.h1>

          {/* Shimmer line */}
          <div className="shimmer-line" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
