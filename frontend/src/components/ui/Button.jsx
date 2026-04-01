import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-[1.02] active:scale-[0.97]',
  ghost: 'border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50 active:scale-[0.97]',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 active:scale-[0.97]',
  secondary: 'bg-white/[0.05] border border-white/[0.1] text-white/70 hover:bg-white/[0.1] hover:text-white active:scale-[0.97]',
};

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  loading = false, 
  disabled = false, 
  pill = false,
  icon,
  ...props 
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`
        inline-flex items-center justify-center gap-2 
        px-6 py-3 font-semibold
        ${pill ? 'rounded-full' : 'rounded-xl'}
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:scale-100 disabled:hover:shadow-none
        ${variants[variant] || variants.primary}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}
