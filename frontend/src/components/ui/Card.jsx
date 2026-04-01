import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ 
  children, 
  className = '', 
  hover = false, 
  glow = false,
  animate = true,
  delay = 0,
  ...props 
}) {
  const baseClasses = `
    bg-[rgba(20,24,36,0.6)] backdrop-blur-xl
    border border-[rgba(245,158,11,0.2)]
    rounded-2xl transition-all duration-300
    ${hover ? 'hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:border-[rgba(245,158,11,0.4)] cursor-pointer' : ''}
    ${glow ? 'shadow-[0_0_30px_rgba(245,158,11,0.15)]' : ''}
    ${className}
  `;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}
