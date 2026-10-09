import React, { useState } from 'react';
import { Shield, Cpu, Code, BookOpen, Terminal } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';

export const About: React.FC = () => {
  const [activeSkillTab, setActiveSkillTab] = useState<number>(0);

  return (
    <section
      id="about"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-white/5 relative bg-white dark:bg-[#090b0e]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold mb-2">
            // ABOUT
          </div>
          <h2
            id="about-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-slate-900 dark:text-white tracking-tight"
          >
            About Me
          </h2>
        </div>

        {/* Narrative & Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Main Story Narrative */}
          <div className="lg:col-span-7 space-y-6 text-slate-700 dark:text-zinc-300 font-sans text-base sm:text-lg leading-relaxed">
            <p>
              My name is <strong className="text-slate-900 dark:text-white font-semibold">Vedant Sattegiri Patil</strong>, also known as{' '}
              <span className="text-emerald-700 dark:text-emerald-400 font-mono text-sm px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                &lt;VEX&gt;
              </span>{' '}
              in developer and security circles. I am a 15-year-old student-builder from Pune, India, balancing secondary school studies with deconstructing complex software systems, discovering security vulnerabilities, and building AI-driven products.
            </p>

            <p>
              My learning path is entirely self-directed. Instead of taking modern abstractions for granted, I became captivated by understanding how applications fail under stress: tracing raw HTTP frames, inspecting authorization logic with Burp Suite, hunting IDORs, and exploring how edge cases compromise systems.
            </p>

            <p>
              This offensive security mindset directly elevates how I write software. Whether designing an AI self-improvement platform like{' '}
              <span className="text-slate-900 dark:text-white font-medium">AETHOS</span> or crafting focused tools like{' '}
              <span className="text-slate-900 dark:text-white font-medium">Inkwell</span>, I build with defensive resilience, strict privacy, and attention to user experience.
            </p>

            <div className="pt-2">
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 space-y-2">
                <div className="text-emerald-600 dark:text-emerald-400 font-mono text-xs flex items-center space-x-2 font-semibold">
                  <Terminal className="w-4 h-4" />
                  <span>CORE PRINCIPLE</span>
                </div>
                <p className="italic text-base sm:text-lg text-slate-800 dark:text-zinc-200 leading-relaxed">
                  "You cannot genuinely secure what you don't understand how to dismantle. And you cannot build resilient autonomous systems without rigorous boundary defenses."
                </p>
              </div>
            </div>
          </div>

          {/* Current Focus Cards: 3 Pillars */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-slate-500 dark:text-zinc-500 font-mono text-xs uppercase tracking-wider pb-2 border-b border-slate-200 dark:border-white/10 font-semibold">
              // CURRENT RESEARCH FOCUS
            </div>

            {/* Pillar 1: Bug Bounty */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#0d1017] border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500/40 transition-colors shadow-sm">
              <div className="flex items-center space-x-2.5 text-emerald-600 dark:text-emerald-400 mb-2">
                <Shield className="w-5 h-5 flex-shrink-0" />
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white">Bug Bounty & AppSec</h3>
              </div>
              <p className="text-slate-600 dark:text-zinc-300 leading-relaxed font-sans text-sm sm:text-base">
                Actively hunting vulnerabilities on web applications: deep-dives into IDORs, access control flaws, and custom automated recon tooling.
              </p>
            </div>

            {/* Pillar 2: AI Tooling */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#0d1017] border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500/40 transition-colors shadow-sm">
              <div className="flex items-center space-x-2.5 text-emerald-600 dark:text-emerald-400 mb-2">
                <Cpu className="w-5 h-5 flex-shrink-0" />
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white">Autonomous AI Systems</h3>
              </div>
              <p className="text-slate-600 dark:text-zinc-300 leading-relaxed font-sans text-sm sm:text-base">
                Developing intelligent agent workflows that execute complex multi-step toolchains with deterministic guardrails and local LLMs.
              </p>
            </div>

            {/* Pillar 3: Content (RootCause) */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#0d1017] border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500/40 transition-colors shadow-sm">
              <div className="flex items-center space-x-2.5 text-emerald-600 dark:text-emerald-400 mb-2">
                <BookOpen className="w-5 h-5 flex-shrink-0" />
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white">RootCause Media</h3>
              </div>
              <p className="text-slate-600 dark:text-zinc-300 leading-relaxed font-sans text-sm sm:text-base">
                Producing high-signal short-form video content covering software architecture and real-world cybersecurity vulnerabilities.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Arsenal & Toolset Matrix */}
        <div id="skills-matrix" className="pt-10 border-t border-slate-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold">
                // ARSENAL & TOOLKIT
              </div>
              <h3 className="text-2xl font-sans font-bold text-slate-900 dark:text-white mt-1">
                Disciplines & Capabilities
              </h3>
            </div>

            {/* Tab Switches */}
            <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-zinc-900/90 p-1.5 rounded-lg border border-slate-200 dark:border-white/10 font-sans text-sm">
              {SKILL_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.title}
                  type="button"
                  onClick={() => setActiveSkillTab(idx)}
                  className={`px-3.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    activeSkillTab === idx
                      ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-400 shadow-sm border border-slate-200/80 dark:border-emerald-500/30'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {idx === 0 ? 'Security' : idx === 1 ? 'AI / Systems' : 'Engineering'}
                </button>
              ))}
            </div>
          </div>

          {/* Active Skills Category Card */}
          <div className="rounded-xl bg-slate-50 dark:bg-[#0c0f15] border border-slate-200 dark:border-white/10 p-6 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center space-x-2.5 text-slate-900 dark:text-white">
                {activeSkillTab === 0 && <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                {activeSkillTab === 1 && <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                {activeSkillTab === 2 && <Code className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                <span className="font-sans font-bold text-base text-slate-900 dark:text-white">
                  {SKILL_CATEGORIES[activeSkillTab].title}
                </span>
              </div>
              <span className="text-slate-500 dark:text-zinc-400 text-sm hidden sm:inline">
                {SKILL_CATEGORIES[activeSkillTab].description}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SKILL_CATEGORIES[activeSkillTab].skills.map((skill) => (
                <div
                  key={skill.name}
                  className="p-4 rounded-lg bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sans font-semibold text-sm text-slate-900 dark:text-zinc-200">
                      {skill.name}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      {skill.proficiency}
                    </span>
                  </div>
                  <p className="text-sm font-sans text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {skill.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
