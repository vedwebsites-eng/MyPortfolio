import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, ArrowDown, ExternalLink, Github, MapPin, Compass } from 'lucide-react';
import { PERSONAL_INFO, TERMINAL_ROTATING_TITLES } from '../data/portfolioData';

interface HeroProps {
  onOpenTerminal: () => void;
  onOpenResume: () => void;
}

// Isolated typing prompt sub-component to prevent re-rendering the whole Hero tree on every typed key
const HeroTypingPrompt: React.FC = React.memo(() => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(65);

  useEffect(() => {
    const fullText = TERMINAL_ROTATING_TITLES[titleIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText.length + 1 === fullText.length) {
          // Pause at end of text before deleting
          setTypingSpeed(2200);
          setIsDeleting(true);
        } else {
          setTypingSpeed(45 + Math.random() * 30);
        }
      } else {
        // Deleting backward
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % TERMINAL_ROTATING_TITLES.length);
          setTypingSpeed(300);
        } else {
          setTypingSpeed(25);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, titleIndex, typingSpeed]);

  return (
    <div className="pl-3 sm:pl-6 text-zinc-200 min-h-[3.25rem] h-auto py-1 flex items-start sm:items-center flex-wrap break-words leading-relaxed">
      <span className="text-cyan-300 font-medium">"{currentText}"</span>
      <span className="inline-block w-2 h-4 ml-1 bg-emerald-400 animate-cursor-blink flex-shrink-0" />
    </div>
  );
});

export const Hero: React.FC<HeroProps> = React.memo(({ onOpenTerminal, onOpenResume }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[clamp(32rem,calc(100vh-4rem),56rem)] flex flex-col justify-center py-[clamp(2.5rem,6vh,5rem)] px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-radial-fade"
    >
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-60" />

      <div className="relative max-w-5xl mx-auto w-full z-10">
        {/* Terminal Header Prompt Bar */}
        <div
          id="hero-terminal-badge"
          className="inline-flex items-center space-x-2.5 py-1.5 font-mono text-xs text-zinc-400 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-500">host:</span>
          <span className="text-zinc-300">pune-node-01</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-500">status:</span>
          <span className="text-emerald-400">active_researcher</span>
        </div>

        {/* Name in elegant Playfair Display + Moniker */}
        <div className="space-y-3 mb-6">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1
              id="hero-name-title"
              className="text-[clamp(2rem,5.5vw,4.5rem)] font-serif tracking-tight text-white font-normal break-words leading-[1.1]"
            >
              Vedant Sattegiri Patil
            </h1>
            <span
              id="hero-moniker-tag"
              className="font-mono text-sm sm:text-base text-emerald-400/90 px-1 py-0.5"
            >
              &lt;VEX /&gt;
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-mono text-zinc-400">
            <span className="flex items-center space-x-1 text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Pune, India</span>
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Cybersecurity &times; AI &times; Systems</span>
          </div>
        </div>

        {/* Terminal Command & Live Typing Area */}
        <div
          id="hero-typing-box"
          className="rounded-lg bg-[#0d1017] border border-white/10 p-4 sm:p-5 mb-8 shadow-xl font-mono text-xs sm:text-sm overflow-hidden"
        >
          {/* Mock terminal window dots */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 text-zinc-500 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
              <span className="ml-2 text-zinc-400">bash — 80x24</span>
            </div>
            <div className="text-zinc-500 hidden sm:block">utf-8 • zsh</div>
          </div>

          {/* Shell prompt & typed sentence */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2 text-zinc-400">
              <span className="text-emerald-400 font-semibold select-none">vex@pune:~$</span>
              <span className="text-zinc-300">cat current_focus.txt</span>
            </div>
            <HeroTypingPrompt />
          </div>
        </div>

        {/* Identity statement & unified dual-focus explanation */}
        <p
          id="hero-bio-paragraph"
          className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-3xl mb-8 font-sans font-light"
        >
          Engineering software with a security-first posture and building intelligent systems from first principles.
          Splitting deep focus between{' '}
          <span className="text-emerald-300 font-mono text-sm px-1 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            vulnerability research
          </span>
          ,{' '}
          <span className="text-cyan-300 font-mono text-sm px-1 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
            autonomous AI tooling
          </span>
          , and dissecting real-world cyber exploits on{' '}
          <span className="text-amber-300 font-mono text-sm px-1 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
            RootCause
          </span>
          .
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <a
            href="#projects"
            id="hero-btn-explore"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-md bg-emerald-500 text-zinc-950 font-semibold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-950/40 cursor-pointer"
          >
            <span>Explore Projects</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onOpenTerminal}
            id="hero-btn-cli"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-md bg-zinc-900 border border-white/15 text-zinc-200 hover:border-emerald-500/40 hover:text-emerald-300 transition-all cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Launch CLI Terminal</span>
          </button>

          <a
            href={PERSONAL_INFO.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="hero-btn-github"
            className="inline-flex items-center space-x-2 px-3.5 py-2.5 rounded-md bg-zinc-900/60 border border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20 transition-all"
          >
            <Github className="w-3.5 h-3.5" />
            <span>@{PERSONAL_INFO.githubUsername}</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>

          <button
            onClick={onOpenResume}
            id="hero-btn-resume"
            className="inline-flex items-center space-x-2 px-3.5 py-2.5 rounded-md bg-zinc-900/60 border border-white/10 text-zinc-400 hover:text-emerald-300 hover:border-emerald-500/30 transition-all cursor-pointer"
          >
            <span>Read CV</span>
          </button>
        </div>

        {/* Telemetry quick status bar */}
        <div
          id="hero-telemetry-grid"
          className="mt-12 pt-6 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono text-xs min-w-0"
        >
          <div className="space-y-1 min-w-0">
            <span className="text-zinc-500 block text-[10px] tracking-wider uppercase">// DISCIPLINE</span>
            <span className="text-zinc-300 flex items-center space-x-1.5 truncate">
              <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="truncate">Cybersecurity</span>
            </span>
          </div>

          <div className="space-y-1 min-w-0">
            <span className="text-zinc-500 block text-[10px] tracking-wider uppercase">// INTELLIGENCE</span>
            <span className="text-zinc-300 flex items-center space-x-1.5 truncate">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="truncate">Autonomous AI</span>
            </span>
          </div>

          <div className="space-y-1 min-w-0">
            <span className="text-zinc-500 block text-[10px] tracking-wider uppercase">// LOCATION</span>
            <span className="text-zinc-300 flex items-center space-x-1.5 truncate">
              <Compass className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">Pune, MH (IN)</span>
            </span>
          </div>

          <div className="space-y-1 min-w-0">
            <span className="text-zinc-500 block text-[10px] tracking-wider uppercase">// ACTIVE_WORK</span>
            <span className="text-emerald-400 font-medium truncate block">Bounties + Aethos</span>
          </div>
        </div>
      </div>
    </section>
  );
});
