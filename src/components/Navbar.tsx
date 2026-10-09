import React, { useState, useEffect } from 'react';
import { Terminal, FileText, Menu, X } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ThemeToggle } from './ThemeToggle';
import { downloadResumePdf } from '../utils/pdfGenerator';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenTerminal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenTerminal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Track scroll depth for navbar blur styling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const next = window.scrollY > 15;
          setIsScrolled((prev) => (prev !== next ? next : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section observer to highlight the link of the section currently in view
  useEffect(() => {
    const sections = ['about', 'projects', 'guestbook', 'contact'];
    const handleSectionSpy = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          return;
        }
      }
      if (window.scrollY < 120) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleSectionSpy, { passive: true });
    handleSectionSpy();
    return () => window.removeEventListener('scroll', handleSectionSpy);
  }, []);

  const navLinks = [
    { id: 'about', label: 'About', href: '#about' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'guestbook', label: 'Guestbook', href: '#guestbook' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#090b0e]/95 backdrop-blur-md shadow-sm border-slate-200/80 dark:border-white/10'
          : 'bg-white/80 dark:bg-[#090b0e]/80 backdrop-blur-sm border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Name as plain text logo (sans-serif font, no prompt, no pulsing dot) */}
        <a
          href="#"
          id="nav-logo-link"
          className="font-sans font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          {PERSONAL_INFO.name}
        </a>

        {/* Center: Plain readable text links (About, Projects, Guestbook, Contact) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center space-x-1 sm:space-x-2 text-sm font-sans"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                id={`nav-link-${link.id}`}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-semibold'
                    : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right side: Terminal secondary icon, one clear Resume button, and ThemeToggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Small secondary Terminal icon button */}
          <button
            id="btn-quick-terminal"
            onClick={onOpenTerminal}
            type="button"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Open Interactive Terminal (⌘K)"
            aria-label="Open Interactive Terminal"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* One clear Resume button */}
          <button
            id="btn-nav-resume"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              downloadResumePdf('vedant_sattegiri_patil_cv.pdf');
              onOpenResume();
            }}
            title="Download and view Resume"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-sm font-sans font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </button>

          {/* ThemeToggle */}
          <ThemeToggle id="btn-nav-theme-toggle" />

          {/* Mobile hamburger menu toggle */}
          <button
            id="btn-mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu with big tap-friendly links (min 44px height) */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden border-b border-slate-200 dark:border-white/10 bg-white/98 dark:bg-[#0c0e12]/98 backdrop-blur-md px-4 py-4 space-y-2 font-sans text-base shadow-lg"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center min-h-[44px] px-3.5 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-semibold'
                    : 'text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            );
          })}

          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                downloadResumePdf('vedant_sattegiri_patil_cv.pdf');
                onOpenResume();
              }}
              className="flex-1 flex items-center justify-center space-x-2 min-h-[44px] px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Download Resume</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTerminal();
              }}
              className="min-h-[44px] px-3 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
              title="Terminal"
              aria-label="Terminal"
            >
              <Terminal className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
