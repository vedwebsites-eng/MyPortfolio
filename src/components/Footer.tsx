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
      className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#06080b] border-t border-slate-200 dark:border-white/5 font-sans text-sm text-slate-600 dark:text-zinc-400"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Main Row: branding | sitemap | socials+back-to-top */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Branding */}
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-900 dark:text-white font-semibold">
              <span>Vedant Sattegiri Patil</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-normal">&lt;VEX&gt;</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Student developer & security researcher based in Pune, India
            </p>
          </div>

          {/* Center: Sitemap Nav */}
          <nav aria-label="Footer Sitemap" className="flex items-center space-x-4 text-sm font-medium text-slate-600 dark:text-zinc-300">
            <a href="#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              About
            </a>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <a href="#projects" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Projects
            </a>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <a href="#guestbook" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Guestbook
            </a>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <a href="#contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Contact
            </a>
            {onNavigate404 && (
              <>
                <span className="text-slate-300 dark:text-zinc-700">•</span>
                <button
                  onClick={onNavigate404}
                  className="text-slate-400 hover:text-emerald-600 dark:text-zinc-500 dark:hover:text-emerald-400 transition-colors cursor-pointer text-xs font-mono"
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

