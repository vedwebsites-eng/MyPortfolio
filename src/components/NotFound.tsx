import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Terminal,
  Home,
  CornerDownLeft,
  ShieldAlert,
  Compass,
  RefreshCw,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface NotFoundProps {
  currentPath: string;
  onNavigateHome: () => void;
  onOpenTerminal?: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({
  currentPath,
  onNavigateHome,
  onOpenTerminal,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [terminalLog, setTerminalLog] = useState<string[]>([
    `[SYS_INIT] Probing route table for target: "${currentPath || '/404'}"...`,
    `[ERR_ROUTE_MISS] No matching controller found in manifest.`,
    `[SECURITY_AUDIT] Request logged. Type 'help' or 'cd /' to return to system root.`,
  ]);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now);
    setCurrentTime(`${formatted} IST`);
  }, []);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = commandInput.trim().toLowerCase();
    if (!raw) return;

    const newLogs = [...terminalLog, `vex@pune:~$ ${raw}`];

    switch (raw) {
      case 'help':
        newLogs.push('Available commands: home (or cd /), ls, whoami, ping, clear');
        break;
      case 'home':
      case 'cd /':
      case 'cd':
        newLogs.push('Navigating back to system root (/). Redirecting...');
        setTerminalLog(newLogs);
        setTimeout(() => {
          onNavigateHome();
        }, 300);
        return;
      case 'ls':
        newLogs.push('drwxr-xr-x  about/    projects/    cli/    transmission/    cv.pdf');
        break;
      case 'whoami':
        newLogs.push(`Vedant Sattegiri Patil <${PERSONAL_INFO.handle}> - Student-Builder & Security Researcher`);
        break;
      case 'ping':
        newLogs.push('64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms');
        break;
      case 'clear':
        setTerminalLog([`Terminal cleared. Type 'help' or 'cd /' to navigate.`]);
        setCommandInput('');
        return;
      default:
        newLogs.push(`command not found: "${raw}". Type 'help' or 'cd /' to exit.`);
        break;
    }

    setTerminalLog(newLogs);
    setCommandInput('');
  };

  return (
    <div
      id="custom-404-viewport"
      className="min-h-screen bg-[#080b0f] text-[#d6d9e0] flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden"
    >
      {/* Background Ambience / Subtle Grid Lines */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

      {/* Top Header Status */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between border-b border-white/10 pb-4 relative z-10 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-rose-400 font-semibold">ERR_404_ROUTE_UNDEFINED</span>
          <span className="text-zinc-600">::</span>
          <span className="text-zinc-400 hidden sm:inline">SECURITY_AUDIT_LOGGED</span>
        </div>

        <div className="flex items-center space-x-3 text-zinc-400">
          <span className="text-zinc-500 hidden md:inline">NODE: PUNE_IN</span>
          <span className="text-emerald-400">{currentTime || '00:00:00 IST'}</span>
          <button
            onClick={onNavigateHome}
            className="px-2.5 py-1 rounded bg-zinc-900 border border-white/10 hover:border-emerald-500/30 text-zinc-300 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span>Root (/)</span>
          </button>
        </div>
      </header>

      {/* Main 404 Hero Content */}
      <main className="max-w-4xl w-full mx-auto my-auto py-12 relative z-10 space-y-8">
        <div className="space-y-4">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>HTTP STATUS: 404 // RESOURCE NOT FOUND</span>
          </div>

          {/* Big Editorial Serif Title */}
          <h1
            id="404-heading"
            className="text-4xl sm:text-6xl font-serif font-normal text-white tracking-tight leading-none"
          >
            Zero Route Detected at this Address
          </h1>

          {/* Subtext description */}
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl font-sans font-light leading-relaxed">
            The requested path{' '}
            <code className="px-2 py-0.5 rounded bg-zinc-900 text-emerald-300 font-mono text-xs border border-white/10">
              {currentPath || '/unknown-route'}
            </code>{' '}
            does not exist in the routing table of node <span className="text-white font-mono">vex@pune</span>.
            This could be a deprecated URL, an exploratory crawl, or an unauthorized route probe.
          </p>
        </div>

        {/* Diagnostic Monospace Terminal Card */}
        <div className="rounded-xl bg-[#0d1017] border border-white/10 p-4 sm:p-5 font-mono text-xs space-y-3 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/5 text-zinc-500 text-[11px]">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-zinc-300 font-semibold">DIAGNOSTIC CRASH REPORT</span>
            </div>
            <span>PROTOCOL: HTTP/2 TLS_AES_256_GCM_SHA384</span>
          </div>

          {/* Log lines */}
          <div className="space-y-1 text-zinc-400 text-[11px] bg-[#07090d] p-3 rounded border border-white/5 font-mono overflow-x-auto max-h-36 overflow-y-auto">
            {terminalLog.map((log, index) => (
              <div
                key={index}
                className={
                  log.startsWith('vex@pune')
                    ? 'text-cyan-300 font-semibold'
                    : log.includes('ERR_')
                    ? 'text-rose-400'
                    : log.includes('[SYS_INIT]')
                    ? 'text-zinc-500'
                    : 'text-zinc-300'
                }
              >
                {log}
              </div>
            ))}
          </div>

          {/* Interactive Input Form */}
          <form onSubmit={handleCommandSubmit} className="flex items-center space-x-2 pt-1">
            <span className="text-emerald-400 font-semibold select-none">vex@pune:~$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Type 'cd /' to return home or 'help'..."
              className="flex-1 bg-transparent text-white text-xs focus:outline-none placeholder-zinc-600 font-mono"
              autoFocus
            />
            <button
              type="submit"
              className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 text-[11px] flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <span>Execute</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
          <button
            onClick={onNavigateHome}
            id="btn-404-return-home"
            className="px-4 py-2.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all flex items-center space-x-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>cd / (Return to Home)</span>
          </button>

          {onOpenTerminal && (
            <button
              onClick={onOpenTerminal}
              id="btn-404-open-terminal"
              className="px-4 py-2.5 rounded-lg bg-zinc-900 text-zinc-200 border border-white/10 hover:border-cyan-500/40 hover:text-cyan-300 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Launch Interactive CLI Shell</span>
            </button>
          )}

          <a
            href={`mailto:${PERSONAL_INFO.email}?subject=Broken%20Link%20Report%20(${encodeURIComponent(currentPath)})`}
            className="px-4 py-2.5 rounded-lg bg-zinc-900/60 text-zinc-400 border border-white/5 hover:border-white/20 hover:text-zinc-200 transition-all flex items-center space-x-2"
          >
            <Compass className="w-4 h-4 text-zinc-500" />
            <span>Report Broken Endpoint</span>
          </a>
        </div>
      </main>

      {/* Footer info */}
      <footer className="max-w-5xl w-full mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-zinc-600 font-mono text-[11px] gap-2 relative z-10">
        <div>
          Vedant Sattegiri Patil &bull; Node: Pune, Maharashtra, India (IST)
        </div>
        <div className="flex items-center space-x-3">
          <span>IDENTITY: &lt;VEX&gt;</span>
          <span>&bull;</span>
          <span>STATUS: FAILOVER_ACTIVE</span>
        </div>
      </footer>
    </div>
  );
};
