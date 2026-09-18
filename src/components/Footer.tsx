import React from 'react';
import { ArrowUp, Terminal, Shield, Github, Mail, Heart } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  onNavigate404?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate404 }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      className="py-12 px-4 sm:px-6 lg:px-8 bg-[#06080b] border-t border-white/5 font-mono text-xs text-zinc-500"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Branding & Location */}
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white">Vedant Sattegiri Patil</span>
            <span className="text-emerald-400">&lt;VEX&gt;</span>
          </div>
          <div className="text-[11px] text-zinc-500">
            15-year-old student-builder • Pune, India (IST) • Cybersecurity &times; AI
          </div>
        </div>

        {/* Center: Tech summary & 404 probe */}
        <div className="text-center text-[11px] text-zinc-500 space-y-1">
          <div>Minimal Terminal Aesthetic • Playfair Display + Monospace</div>
          <div className="flex items-center justify-center space-x-2 text-zinc-600">
            <span>Encrypted Local-First Mindset</span>
            <span>&bull;</span>
            {onNavigate404 && (
              <button
                onClick={onNavigate404}
                className="hover:text-emerald-400 underline underline-offset-2 transition-colors cursor-pointer"
                title="Preview Custom 404 Page"
              >
                [404 endpoint]
              </button>
            )}
          </div>
        </div>

        {/* Right: Social icons & back to top */}
        <div className="flex items-center space-x-4">
          <a
            href={PERSONAL_INFO.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="text-zinc-400 hover:text-emerald-400 transition-colors"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>

          <button
            onClick={scrollToTop}
            className="p-2 rounded bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-emerald-500/30 transition-all cursor-pointer"
            title="Return to top of page"
            aria-label="Return to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
