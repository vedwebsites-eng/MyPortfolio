import React, { useEffect, useRef } from 'react';

export const ScrollProgressBar: React.FC = React.memo(() => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const telemetryBoxRef = useRef<HTMLDivElement>(null);
  const percentTextRef = useRef<HTMLSpanElement>(null);
  const eofBadgeRef = useRef<HTMLSpanElement>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = documentHeight - viewportHeight;

      if (maxScroll <= 0) {
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = 'scaleX(0)';
        }
        if (telemetryBoxRef.current) {
          telemetryBoxRef.current.style.opacity = '0';
          telemetryBoxRef.current.style.transform = 'translateY(-4px)';
          telemetryBoxRef.current.style.pointerEvents = 'none';
        }
        return;
      }

      const fraction = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      const rounded = Math.round(fraction * 100);

      // GPU-accelerated transform directly on DOM without layout reflow
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${fraction})`;
      }

      // Update telemetry badge DOM directly to avoid re-rendering entire React component tree
      if (telemetryBoxRef.current) {
        if (rounded > 1) {
          telemetryBoxRef.current.style.opacity = '1';
          telemetryBoxRef.current.style.transform = 'translateY(0)';
          telemetryBoxRef.current.style.pointerEvents = 'auto';
        } else {
          telemetryBoxRef.current.style.opacity = '0';
          telemetryBoxRef.current.style.transform = 'translateY(-4px)';
          telemetryBoxRef.current.style.pointerEvents = 'none';
        }
      }

      if (percentTextRef.current) {
        percentTextRef.current.textContent = `${rounded.toString().padStart(2, '0')}%`;
      }

      if (eofBadgeRef.current) {
        eofBadgeRef.current.textContent = rounded >= 99 ? 'EOF' : 'STREAM';
      }
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        updateProgress();
        rafIdRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div
      id="scroll-progress-bar-container"
      className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
      aria-hidden="true"
    >
      {/* Top track background */}
      <div className="w-full h-[2.5px] bg-zinc-950/90 relative overflow-hidden">
        {/* Dynamic gradient bar - GPU accelerated with scaleX */}
        <div
          ref={progressBarRef}
          id="scroll-progress-indicator"
          className="h-full w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_10px_rgba(16,185,129,0.8)] origin-left will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Floating Monospace Terminal Telemetry Badge */}
      <div
        ref={telemetryBoxRef}
        id="scroll-depth-telemetry"
        className="absolute top-[2.5px] right-4 sm:right-8 opacity-0 -translate-y-1 pointer-events-none transition-all duration-200"
      >
        <div className="font-mono text-[10px] text-zinc-400 bg-[#06080b] border-x border-b border-white/10 px-2 py-0.5 rounded-b-md flex items-center space-x-1.5 shadow-lg select-none">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-zinc-500">//</span>
          <span className="text-zinc-400">DEPTH:</span>
          <span ref={percentTextRef} className="text-emerald-300 font-semibold tabular-nums">
            00%
          </span>
          <span className="text-zinc-600">|</span>
          <span ref={eofBadgeRef} className="text-cyan-400/90 text-[9px] uppercase tracking-wider">
            STREAM
          </span>
        </div>
      </div>
    </div>
  );
});
