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
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { NotFound } from './components/NotFound';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false);
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

        {/* Projects Section */}
        <Projects />

        {/* Embedded Interactive CLI Shell */}
        <InteractiveTerminal
          onOpenResume={() => setIsResumeOpen(true)}
          onNavigate404={() => navigate('/404')}
        />

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
