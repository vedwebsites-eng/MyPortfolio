/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { GuestbookSection } from './components/GuestbookSection';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { NotFound } from './components/NotFound';
import { ThemeTransitionWave } from './components/ThemeTransitionWave';
import { TerminalBootScreen } from './components/TerminalBootScreen';
import { CheckCircle, AlertCircle } from 'lucide-react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export default function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false);
  const [isKonamiDevMode, setIsKonamiDevMode] = useState(false);
  const [bootReady, setBootReady] = useState(false);
  const [notification, setNotification] = useState<{ message: string; isError?: boolean } | null>(null);

  const konamiBufferRef = React.useRef<string[]>([]);
  const konamiTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const showNotification = (message: string, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 4000);
  };

  // Global keyboard shortcuts: Cmd+K, Backtick, Escape, and Konami Code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K opens terminal anywhere on the page
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsTerminalModalOpen((prev) => !prev);
        return;
      }

      // Toggle terminal on backtick (`), except when typing in inputs
      if (e.key === '`' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsTerminalModalOpen((prev) => !prev);
        return;
      }

      // Escape closes modals
      if (e.key === 'Escape') {
        setIsResumeOpen(false);
        setIsTerminalModalOpen(false);
        return;
      }

      // Konami code sequence check (only when not typing in text fields)
      if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        if (konamiTimeoutRef.current) {
          clearTimeout(konamiTimeoutRef.current);
        }
        konamiTimeoutRef.current = setTimeout(() => {
          konamiBufferRef.current = [];
        }, 2500);

        const currentKey = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        const expectedKey = KONAMI_CODE[konamiBufferRef.current.length];

        if (currentKey === expectedKey) {
          konamiBufferRef.current.push(currentKey);
          if (konamiBufferRef.current.length === KONAMI_CODE.length) {
            konamiBufferRef.current = [];
            setIsKonamiDevMode(true);
            setIsTerminalModalOpen(true);
            showNotification('⚡ [ACCESS GRANTED] Konami Dev-Mode Override Activated!');
          }
        } else {
          // If the key is the start of a new sequence (ArrowUp), keep it
          if (currentKey === KONAMI_CODE[0]) {
            konamiBufferRef.current = [currentKey];
          } else {
            konamiBufferRef.current = [];
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (konamiTimeoutRef.current) {
        clearTimeout(konamiTimeoutRef.current);
      }
    };
  }, []);

  const is404 = currentPath !== '/' && currentPath !== '' && currentPath !== '/index.html';

  if (is404) {
    return (
      <div className="min-h-screen bg-[#080b0f] text-[#d6d9e0] font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <ThemeTransitionWave />
        <ScrollProgressBar />
        <NotFound
          currentPath={currentPath}
          onNavigateHome={() => navigate('/')}
          onOpenTerminal={() => setIsTerminalModalOpen(true)}
        />

        {isTerminalModalOpen && (
          <InteractiveTerminal
            isModal={true}
            onClose={() => {
              setIsTerminalModalOpen(false);
              setIsKonamiDevMode(false);
            }}
            onOpenResume={() => {
              setIsTerminalModalOpen(false);
              setIsResumeOpen(true);
            }}
            isKonamiDevMode={isKonamiDevMode}
          />
        )}

        {notification && (
          <div
            role="status"
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl font-mono text-xs border shadow-2xl flex items-center space-x-3 transition-all animate-bounce ${
              notification.isError
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                : 'bg-[#0d141e]/95 border-emerald-500/40 text-emerald-300'
            }`}
          >
            {notification.isError ? (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090b0e] text-[#d6d9e0] font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Monospace Terminal Boot Screen Transition (once per session, skippable) */}
      <TerminalBootScreen onComplete={() => setBootReady(true)} />

      <ThemeTransitionWave />
      {/* Scroll Depth Monospace Progress Bar */}
      <ScrollProgressBar />

      {/* Top Fixed Navigation */}
      <Navbar
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenTerminal={() => setIsTerminalModalOpen(true)}
      />

      {/* Main Content Layout */}
      <main id="main-content">
        {/* Hero Section */}
        <Hero
          onOpenTerminal={() => setIsTerminalModalOpen(true)}
          onOpenResume={() => setIsResumeOpen(true)}
        />

        {/* About & Story Section */}
        <About />

        {/* Projects Section (Themed per-card: AETHOS, INKWELL paper insert, ROOTCAUSE In The Grind) */}
        <Projects />

        {/* Embedded Interactive CLI Shell */}
        <InteractiveTerminal
          onOpenResume={() => setIsResumeOpen(true)}
          onNavigate404={() => navigate('/404')}
        />

        {/* Cloud Guestbook & Collaboration Notes (Firebase Auth & Firestore) */}
        <GuestbookSection />

        {/* Contact Section */}
        <Contact
          onOpenResume={() => setIsResumeOpen(true)}
          onNotify={showNotification}
        />
      </main>

      {/* Footer */}
      <Footer onNavigate404={() => navigate('/404')} />

      {/* Floating System Toast */}
      {notification && (
        <div
          role="status"
          className={`fixed bottom-6 left-6 sm:left-auto sm:right-24 z-50 px-4 py-3 rounded-xl font-mono text-xs border shadow-2xl flex items-center space-x-3 transition-all animate-bounce ${
            notification.isError
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
              : 'bg-[#0d141e]/95 border-emerald-500/40 text-emerald-300'
          }`}
        >
          {notification.isError ? (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Pop-up Modals */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {isTerminalModalOpen && (
        <InteractiveTerminal
          isModal={true}
          onClose={() => {
            setIsTerminalModalOpen(false);
            setIsKonamiDevMode(false);
          }}
          onOpenResume={() => {
            setIsTerminalModalOpen(false);
            setIsResumeOpen(true);
          }}
          onNavigate404={() => navigate('/404')}
          isKonamiDevMode={isKonamiDevMode}
        />
      )}
    </div>
  );
}
