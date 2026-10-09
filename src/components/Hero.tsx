import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface HeroProps {
  onOpenTerminal?: () => void;
  onOpenResume?: () => void;
}

export const Hero: React.FC<HeroProps> = React.memo(() => {
  return (
    <section
      id="hero"
      className="relative min-h-[75vh] flex flex-col justify-center py-20 sm:py-32 lg:py-36 px-4 sm:px-6 lg:px-8 bg-transparent"
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Name as a large heading */}
        <h1
          id="hero-name-heading"
          className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6"
        >
          {PERSONAL_INFO.name}
        </h1>

        {/* One plain sentence saying who I am and what I do */}
        <p
          id="hero-bio-sentence"
          className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-zinc-300 font-sans font-normal leading-relaxed max-w-2xl mb-10"
        >
          Student developer building autonomous AI tooling, researching cybersecurity vulnerabilities, and engineering resilient software in Pune, India.
        </p>

        {/* Exactly 2 buttons: primary 'View Projects' and secondary 'Contact Me' */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            id="hero-btn-view-projects"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-base shadow-sm hover:shadow transition-all cursor-pointer"
          >
            View Projects
          </a>

          <a
            href="#contact"
            id="hero-btn-contact-me"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white/50 dark:bg-zinc-900/50 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-medium text-base transition-all cursor-pointer"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
});
