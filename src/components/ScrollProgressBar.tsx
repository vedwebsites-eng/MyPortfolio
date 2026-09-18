import React, { useState, useEffect } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = documentHeight - viewportHeight;

      if (maxScroll <= 0) {
        setScrollProgress(0);
        return;
      }

      const progress = Math.min(Math.max((scrollY / maxScroll) * 100, 0), 100);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const formattedPercent = Math.round(scrollProgress);
  const isEof = formattedPercent >= 99;

  return (
    <div
      id="scroll-progress-bar-container"
      className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
      aria-hidden="true"
    >
      {/* Top track background */}
      <div className="w-full h-[2.5px] bg-zinc-950/90 relative overflow-hidden backdrop-blur-sm">
        {/* Dynamic gradient bar */}
        <div
          id="scroll-progress-indicator"
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-75 ease-out shadow-[0_0_10px_rgba(16,185,129,0.8)] relative"
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Terminal leading cursor blip */}
          {scrollProgress > 0 && (
            <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-1.5 h-2 bg-cyan-200 rounded-[1px] shadow-[0_0_8px_#67e8f9] animate-pulse" />
          )}
        </div>
      </div>

      {/* Floating Monospace Terminal Telemetry Badge */}
      <div
        id="scroll-depth-telemetry"
        className={`absolute top-[2.5px] right-4 sm:right-8 transition-all duration-300 transform ${
          scrollProgress > 1
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        <div className="font-mono text-[10px] text-zinc-400 bg-[#06080b]/90 border-x border-b border-white/10 px-2 py-0.5 rounded-b-md backdrop-blur-md flex items-center space-x-1.5 shadow-lg select-none">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-zinc-500">//</span>
          <span className="text-zinc-400">DEPTH:</span>
          <span className="text-emerald-300 font-semibold tabular-nums">
            {formattedPercent.toString().padStart(2, '0')}%
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-cyan-400/90 text-[9px] uppercase tracking-wider">
            {isEof ? 'EOF' : 'STREAM'}
          </span>
        </div>
      </div>
    </div>
  );
};
