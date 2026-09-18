import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export const ThemeTransitionWave: React.FC = () => {
  const { theme, isTransitioning } = useTheme();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="theme-wave"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
          aria-hidden="true"
        >
          {/* Subtle radial aura centered near top-right where navbar toggle sits */}
          <div
            className={`w-full h-full transition-opacity duration-300 ${
              theme === 'light'
                ? 'bg-[radial-gradient(circle_at_88%_30px,rgba(255,255,255,0.4)_0%,rgba(248,250,252,0.1)_60%,transparent_100%)]'
                : 'bg-[radial-gradient(circle_at_88%_30px,rgba(9,11,14,0.4)_0%,rgba(8,11,15,0.1)_60%,transparent_100%)]'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
