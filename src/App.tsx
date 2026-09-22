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
import { GeminiChatModal } from './components/GeminiChatModal';
import { CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; isError?: boolean } | null>(null);
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

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle terminal on backtick (`), except when typing in inputs
      if (e.key === '`' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsTerminalModalOpen((prev) => !prev);
      }
      // Escape closes modals
      if (e.key === 'Escape') {
        setIsResumeOpen(false);
        setIsTerminalModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
            onClose={() => setIsTerminalModalOpen(false)}
            onOpenResume={() => {
              setIsTerminalModalOpen(false);
              setIsResumeOpen(true);
            }}
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
      <ThemeTransitionWave />
      {/* Scroll Depth Monospace Progress Bar */}
      <ScrollProgressBar />

      {/* Top Fixed Navigation */}
      <Navbar
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenTerminal={() => setIsTerminalModalOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
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

        {/* Projects Section (Themed per-card: AETHOS, INKWELL paper insert, ROOTCOUNT In The Grind) */}
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

      {/* Floating Ask VEX AI Dock Trigger */}
      <button
        id="btn-floating-ask-ai"
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#090d14]/95 backdrop-blur-md border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white px-4 py-2.5 rounded-full shadow-[0_0_24px_rgba(6,182,212,0.25)] flex items-center space-x-2 text-xs font-mono transition-all hover:scale-105 cursor-pointer group"
        title="Open Gemini AI Chat Assistant"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:bg-emerald-400 animate-pulse" />
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold tracking-wider">ASK VEX AI</span>
        <span className="hidden sm:inline-block text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-white/5 font-mono">
          GEMINI
        </span>
      </button>

      {/* Floating System Toast */}
      {notification && (
        <div
          role="status"
          className={`fixed bottom-6 left-6 sm:left-auto sm:right-36 z-50 px-4 py-3 rounded-xl font-mono text-xs border shadow-2xl flex items-center space-x-3 transition-all animate-bounce ${
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

      <GeminiChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {isTerminalModalOpen && (
        <InteractiveTerminal
          isModal={true}
          onClose={() => setIsTerminalModalOpen(false)}
          onOpenResume={() => {
            setIsTerminalModalOpen(false);
            setIsResumeOpen(true);
          }}
          onNavigate404={() => navigate('/404')}
        />
      )}
    </div>
  );
}
