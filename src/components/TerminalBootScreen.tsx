import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface TerminalBootScreenProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  'INITIALIZING VEX KERNEL v2.6.4...',
  'LOCATING NODE: PUNE, INDIA [IST / UTC+5:30]',
  'MOUNTING LOCAL VAULT & CRYPTO ENGINE [OK]',
  'LOADING PROFILE: VEDANT SATTEGIRI PATIL (15 Y/O)',
  'ATTACHING SIGNATURE WORKSPACES: AETHOS // ROOTCAUSE // INKWELL',
  'SYSTEM READY // LAUNCHING INTERFACE...',
];

export const TerminalBootScreen: React.FC<TerminalBootScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('vex_boot_completed');
    }
    return false;
  });

  const [activeLogCount, setActiveLogCount] = useState(1);
  const [progress, setProgress] = useState(15);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  const dismiss = () => {
    if (!visible || isFadingOut) return;
    try {
      sessionStorage.setItem('vex_boot_completed', 'true');
    } catch {
      // Ignore storage errors in private browsing
    }
    setIsFadingOut(true);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 280);
  };

  useEffect(() => {
    if (!visible) {
      onComplete();
      return;
    }

    // Step-by-step terminal log reveal
    const stepInterval = setInterval(() => {
      setActiveLogCount((prev) => {
        if (prev < BOOT_LOGS.length) {
          return prev + 1;
        }
        return prev;
      });
      setProgress((prev) => Math.min(100, prev + 18));
    }, 200);

    // Auto dismiss after ~1.4 seconds max
    const autoDismissTimer = setTimeout(() => {
      dismiss();
    }, 1450);

    // Keyboard dismiss listener
    const handleKeyDown = () => {
      dismiss();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(autoDismissTimer);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      id="terminal-boot-screen"
      onClick={dismiss}
      className={`fixed inset-0 z-50 bg-[#090b0e] flex flex-col justify-between p-6 sm:p-12 font-mono text-xs select-none transition-opacity duration-300 cursor-pointer ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="dialog"
      aria-label="Terminal Boot Sequence"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between text-zinc-500 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2 text-emerald-400">
          <Terminal className="w-4 h-4 animate-pulse" />
          <span className="font-semibold tracking-wider">VEX_SYS_BOOT // ARCH-x86_64</span>
        </div>
        <div className="text-[11px] text-zinc-600">
          [CLICK OR PRESS ANY KEY TO SKIP]
        </div>
      </div>

      {/* Main Boot Log Lines */}
      <div className="max-w-2xl my-auto space-y-2 text-zinc-300">
        <div className="text-zinc-600 mb-2">
          ==================================================<br />
          VEDANT SATTEGIRI PATIL &bull; SYSTEM BIOS REV 2.6.4<br />
          ==================================================
        </div>

        {BOOT_LOGS.slice(0, activeLogCount).map((log, idx) => (
          <div key={idx} className="flex items-start space-x-2 font-mono">
            <span className="text-emerald-400 select-none">&gt;</span>
            <span
              className={
                idx === activeLogCount - 1
                  ? 'text-white font-medium'
                  : 'text-zinc-400'
              }
            >
              {log}
            </span>
          </div>
        ))}

        <div className="pt-2 flex items-center space-x-2">
          <span className="text-emerald-400">&gt;</span>
          <span className="inline-block w-2.5 h-4 bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="space-y-2 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>BOOT STATUS: {progress}%</span>
          <span className="text-emerald-400">FAST_BOOT_ACTIVE</span>
        </div>
        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
