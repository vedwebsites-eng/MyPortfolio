import React, { useState, useEffect } from 'react';
import { FileText, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { downloadResumePdf } from '../utils/pdfGenerator';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenTerminal?: () => void;
}

const NAV_LINKS = [
  { id: 'about', num: '//01.', label: 'about' },
  { id: 'projects', num: '//02.', label: 'projects' },
  { id: 'guestbook', num: '//03.', label: 'guestbook' },
  { id: 'contact', num: '//04.', label: 'contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Track scroll position for transparent vs #090b0e/90 + 1px border background after 20px
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

  // IntersectionObserver Scroll-Spy to highlight current section in view
  useEffect(() => {
    const sectionIds = ['about', 'projects', 'guestbook', 'contact'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // If near the top (in Hero), no section is active
        if (window.scrollY < 180) {
          setActiveSection('');
          return;
        }

        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -40% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    elements.forEach((el) => observer.observe(el));

    const handleScrollTop = () => {
      if (window.scrollY < 180) {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScrollTop, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollTop);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
      setActiveSection(id);
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#090b0e]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Terminal Prompt / Logo (vex@pune:~$) */}
        <a
          href="#"
          id="nav-logo-link"
          className="group flex items-center font-mono text-xs sm:text-sm tracking-tight text-zinc-300 hover:text-white transition-colors min-h-[44px]"
        >
          <span className="text-emerald-400 font-semibold">vex</span>
          <span className="text-zinc-400">@</span>
          <span className="text-zinc-300 group-hover:text-zinc-100 transition-colors">pune</span>
          <span className="text-zinc-400">:</span>
          <span className="text-cyan-400 font-mono">~$</span>
        </a>

        {/* Center: Desktop Navigation Links (text-sm, py-2 px-3 with scroll-spy, 44px tap targets) */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 font-mono">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                id={`nav-link-${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`relative text-sm font-mono py-2 px-3 min-h-[44px] inline-flex items-center rounded-md transition-colors ${
                  isActive
                    ? 'text-white font-medium'
                    : 'text-zinc-400 hover:text-emerald-400'
                }`}
              >
                <span className="text-zinc-400 mr-1">{link.num}</span>
                <span>{link.label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-emerald-400 rounded-full"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Filled emerald resume button then ThemeToggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Resume Download & Modal Trigger - Single filled emerald button (44px tap target) */}
          <button
            id="btn-nav-resume"
            onClick={(e) => {
              e.preventDefault();
              downloadResumePdf('vedant_sattegiri_patil_cv.pdf');
              onOpenResume();
            }}
            title="Download CV as PDF and view resume"
            className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 min-h-[44px] rounded-md text-xs sm:text-sm font-mono font-medium bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors cursor-pointer shadow-sm shadow-emerald-500/20 active:scale-[0.98]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>resume.pdf</span>
          </button>

          {/* Dark / Light Mode Transition Toggle */}
          <ThemeToggle id="btn-nav-theme-toggle" />

          {/* Mobile menu toggle (44px tap target) */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-zinc-300 hover:text-white rounded"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden border-b border-white/10 bg-[#0c0e12]/98 backdrop-blur-sm px-4 py-4 space-y-2 font-mono text-sm max-w-full overflow-hidden"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  scrollToSection(e, link.id);
                }}
                className={`block relative py-2.5 px-3 min-h-[44px] flex items-center rounded transition-colors ${
                  isActive
                    ? 'text-white font-medium bg-white/[0.04]'
                    : 'text-zinc-300 hover:text-emerald-400'
                }`}
              >
                <span className="text-zinc-400 mr-2">{link.num}</span>
                <span>{link.label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-emerald-400 rounded-full"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                downloadResumePdf('vedant_sattegiri_patil_cv.pdf');
                onOpenResume();
              }}
              className="flex-1 flex items-center justify-center space-x-2 py-2.5 min-h-[44px] rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-xs font-mono transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>resume.pdf</span>
            </button>
            <ThemeToggle id="btn-mobile-theme-toggle" showLabel className="py-2.5 min-h-[44px]" />
          </div>
        </div>
      )}
    </header>
  );
};
