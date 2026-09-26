import React, { useState, useEffect } from 'react';
import { Terminal, FileText, Menu, X, Mail } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { initAuth } from '../services/gmailAuth';
import { User } from 'firebase/auth';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenTerminal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenTerminal }) => {
  const [timeString, setTimeString] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);

  // Live Pune (IST) clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to IST
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat('en-GB', options).format(now);
      setTimeString(`${formatted} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => setAuthUser(user),
      () => setAuthUser(null)
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const next = window.scrollY > 20;
          setIsScrolled((prev) => (prev !== next ? next : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#090b0e]/95 backdrop-blur-sm shadow-lg shadow-black/40'
          : 'bg-[#090b0e]/75 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Terminal Prompt / Logo */}
        <a
          href="#"
          id="nav-logo-link"
          className="group flex items-center space-x-2.5 font-mono text-xs sm:text-sm tracking-tight text-zinc-300 hover:text-white transition-colors"
        >
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="text-emerald-400 font-semibold">vex</span>
          <span className="text-zinc-600">@</span>
          <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">pune</span>
          <span className="text-zinc-600">:</span>
          <span className="text-cyan-400 font-mono">~$</span>
          <span className="hidden md:inline-block text-xs px-2.5 py-1 ml-2 text-emerald-400/90 font-mono">
            student-builder
          </span>
        </a>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-mono">
          <a
            href="#about"
            id="nav-link-about"
            className="text-zinc-400 hover:text-emerald-400 transition-colors py-1 hover:translate-y-[-1px]"
          >
            <span className="text-zinc-600 mr-1">//01.</span>about
          </a>
          <a
            href="#projects"
            id="nav-link-projects"
            className="text-zinc-400 hover:text-emerald-400 transition-colors py-1 hover:translate-y-[-1px]"
          >
            <span className="text-zinc-600 mr-1">//02.</span>projects
          </a>
          <a
            href="#terminal"
            id="nav-link-terminal"
            className="text-zinc-400 hover:text-cyan-400 transition-colors py-1 hover:translate-y-[-1px]"
          >
            <span className="text-zinc-600 mr-1">//03.</span>cli
          </a>
          <a
            href="#contact"
            id="nav-link-contact"
            className="text-zinc-400 hover:text-emerald-400 transition-colors py-1 hover:translate-y-[-1px]"
          >
            <span className="text-zinc-600 mr-1">//04.</span>contact
          </a>
        </nav>

        {/* Right: Real-time clock & Action CTAs */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Pune IST Live Clock - Generous padding, no box */}
          <div
            id="pune-live-clock"
            className="hidden lg:flex items-center space-x-2.5 text-xs font-mono text-zinc-300 px-4 py-2"
            title="Current time in Pune, India"
          >
            <span className="text-zinc-500">PUN</span>
            <span className="text-emerald-400 font-medium tracking-wide">{timeString || '00:00:00 IST'}</span>
          </div>

          {/* Gmail API Trigger / Status - Clean unboxed styling with ample padding */}
          <a
            href="#contact"
            id="btn-nav-gmail"
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-mono transition-colors cursor-pointer ${
              authUser
                ? 'text-emerald-300 hover:text-emerald-200'
                : 'text-zinc-300 hover:text-emerald-400'
            }`}
            title={authUser ? `Gmail connected: ${authUser.email}` : 'Gmail API Console'}
          >
            <Mail className={`w-3.5 h-3.5 ${authUser ? 'text-emerald-400' : 'text-zinc-400'}`} />
            <span className="hidden sm:inline">
              {authUser ? 'gmail.online' : 'gmail'}
            </span>
            {authUser && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </a>

          {/* Terminal CLI Quick Trigger - Clean unboxed styling with ample padding */}
          <button
            id="btn-quick-terminal"
            onClick={onOpenTerminal}
            className="hidden sm:inline-flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-mono text-zinc-300 hover:text-emerald-400 transition-colors cursor-pointer group"
            title="Open Interactive Terminal Drawer (⌘K or `)"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>cli</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
              ⌘K
            </span>
          </button>

          {/* Resume Modal Trigger - Clean unboxed styling with ample padding */}
          <button
            id="btn-nav-resume"
            onClick={onOpenResume}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>resume.pdf</span>
          </button>

          {/* Dark / Light Mode Transition Toggle */}
          <ThemeToggle id="btn-nav-theme-toggle" />

          {/* Mobile menu toggle */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden border-b border-white/10 bg-[#0c0e12]/98 backdrop-blur-sm px-4 py-4 space-y-3 font-mono text-sm"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs text-zinc-500">
            <span>LOCATION: PUNE, INDIA</span>
            <span className="text-emerald-400">{timeString}</span>
          </div>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-emerald-400 py-1.5"
          >
            <span className="text-zinc-600 mr-2">//01.</span>About
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-emerald-400 py-1.5"
          >
            <span className="text-zinc-600 mr-2">//02.</span>Projects
          </a>
          <a
            href="#terminal"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTerminal();
            }}
            className="block text-zinc-300 hover:text-cyan-400 py-1.5"
          >
            <span className="text-zinc-600 mr-2">//03.</span>Terminal
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-emerald-400 py-1.5"
          >
            <span className="text-zinc-600 mr-2">//04.</span>Contact
          </a>
          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="flex-1 flex items-center justify-center space-x-2 py-2 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Resume</span>
            </button>
            <ThemeToggle id="btn-mobile-theme-toggle" showLabel className="py-2" />
          </div>
        </div>
      )}
    </header>
  );
};
