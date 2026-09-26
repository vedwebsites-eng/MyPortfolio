import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Shield, Github, Mail, Youtube, Check } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  onNavigate404?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate404 }) => {
  const [istTime, setIstTime] = useState<string>('');
  const [copiedPgp, setCopiedPgp] = useState<boolean>(false);
  const copiedTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setIstTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyPgp = () => {
    if (PERSONAL_INFO.pgpFingerprint) {
      navigator.clipboard.writeText(PERSONAL_INFO.pgpFingerprint);
      setCopiedPgp(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopiedPgp(false), 1800);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="main-footer"
      className="py-10 px-4 sm:px-6 lg:px-8 bg-[#06080b] border-t border-white/5 font-mono text-xs text-zinc-500"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Main Row: branding+status+clock | sitemap | socials+back-to-top */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Branding & Status + Live IST Clock */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-white">Vedant Sattegiri Patil</span>
              <span className="text-emerald-400">&lt;VEX&gt;</span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-0.5">
              <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold tracking-wider">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                </span>
                <span>SYSTEM ONLINE</span>
              </span>
              <span className="text-zinc-600">//</span>
              <span className="text-zinc-400 text-[11px] tabular-nums">
                IST: <span className="text-emerald-400 font-medium">{istTime || '--:--:--'}</span>
              </span>
            </div>
          </div>

          {/* Center: Sitemap Nav & 404 Preview */}
          <nav aria-label="Footer Sitemap" className="flex items-center space-x-3 text-xs uppercase tracking-wider text-zinc-400">
            <a href="#about" className="hover:text-emerald-400 transition-colors">
              about
            </a>
            <span className="text-zinc-700">•</span>
            <a href="#projects" className="hover:text-emerald-400 transition-colors">
              projects
            </a>
            <span className="text-zinc-700">•</span>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">
              contact
            </a>
            {onNavigate404 && (
              <>
                <span className="text-zinc-700">•</span>
                <button
                  onClick={onNavigate404}
                  className="text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer normal-case"
                  title="Preview Custom 404 Page"
                >
                  [404]
                </button>
              </>
            )}
          </nav>

          {/* Right: Social icons, PGP copy & back to top */}
          <div className="flex items-center space-x-3.5">
            <a
              href={PERSONAL_INFO.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-zinc-400 hover:text-white transition-colors"
              title="GitHub"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.youtubeUrl || 'https://youtube.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-zinc-400 hover:text-rose-400 transition-colors"
              title="RootCause on YouTube"
              aria-label="RootCause on YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="p-1 text-zinc-400 hover:text-emerald-400 transition-colors"
              title="Email"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <button
              onClick={handleCopyPgp}
              className={`p-1 rounded transition-colors cursor-pointer ${
                copiedPgp ? 'text-emerald-400' : 'text-zinc-400 hover:text-emerald-400'
              }`}
              title={copiedPgp ? 'PGP Fingerprint Copied!' : 'Copy PGP Fingerprint'}
              aria-label="Copy PGP Fingerprint"
            >
              {copiedPgp ? <Check className="w-4 h-4 text-emerald-400" /> : <Shield className="w-4 h-4" />}
            </button>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-emerald-500/30 transition-all cursor-pointer ml-1"
              title="Return to top of page"
              aria-label="Return to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Separated by top border */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500 text-center sm:text-left">
          <div>
            &copy; {currentYear} Vedant Sattegiri Patil. All rights reserved.
          </div>
          <div>
            Built w/ React + TypeScript + Tailwind • Encrypted Local-First Mindset
          </div>
        </div>
      </div>
    </footer>
  );
};

