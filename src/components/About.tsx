import React, { useState } from 'react';
import { Shield, Cpu, Code, BookOpen, Terminal, Sparkles, CheckCircle2, ChevronRight, Binary } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';

export const About: React.FC = () => {
  const [activeSkillTab, setActiveSkillTab] = useState<number>(0);

  return (
    <section
      id="about"
      className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5 relative bg-[#090b0e]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Index & Subtitle */}
        <div className="flex items-center space-x-2 font-mono text-xs text-emerald-400 mb-3">
          <span className="text-zinc-600">//</span>
          <span>01. ABOUT</span>
        </div>

        {/* Serif Header in Playfair Display */}
        <h2
          id="about-heading"
          className="text-3xl sm:text-5xl font-serif text-white font-normal tracking-tight mb-8"
        >
          About
        </h2>

        {/* Narrative & Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Main Story Narrative */}
          <div className="lg:col-span-7 space-y-5 text-zinc-300 font-sans text-base sm:text-lg leading-relaxed font-light">
            <p>
              My name is <span className="text-white font-medium">Vedant Sattegiri Patil</span>, also known as{' '}
              <span className="text-emerald-400 font-mono text-sm px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                &lt;VEX&gt;
              </span>{' '}
              in developer and security communities. I'm 15 years old from Pune, India, and spend my days juggling
              academics in high school with deconstructing software architectures, hunting bugs and building products.
            </p>

            <p>
              My path has been entirely self-directed. Instead of taking higher-level abstractions for granted,
              I became obsessed with understanding what happens when software breaks: reading raw HTTP frames,
              intercepting authentication routines with Burp Suite, tracking down business logic flaws, and seeing
              how memory vulnerabilities emerge in low-level code.
            </p>

            <p>
              That hacker perspective instantly informs my engineering craft. When I build software, be it an
              AI-powered gamified OS like <span className="text-cyan-300 font-mono text-sm">AETHOS</span> or a
              distraction-free editor like <span className="text-amber-300 font-mono text-sm">Inkwell</span>, I
              write every single line with defensive resilience, zero-telemetry privacy, and relentless optimization.
            </p>

            <div className="pt-2">
              <div className="p-4 rounded-lg bg-zinc-900/60 border border-white/10 font-mono text-xs text-zinc-400 space-y-1.5">
                <div className="text-emerald-400 flex items-center space-x-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>CORE PRINCIPLE:</span>
                </div>
                <p className="text-zinc-200 italic font-serif text-sm">
                  "You cannot genuinely secure what you don't know how to dismantle. And you cannot build
                  autonomous systems without rigorous boundary defenses."
                </p>
              </div>
            </div>
          </div>

          {/* Current Focus Cards: 3 Pillars */}
          <div className="lg:col-span-5 space-y-4 font-mono text-xs">
            <div className="text-zinc-500 uppercase tracking-wider text-[11px] pb-1 border-b border-white/5">
              // CURRENT RESEARCH FOCUS
            </div>

            {/* Pillar 1: Bug Bounty */}
            <div className="p-4 rounded-lg bg-[#0d1017] border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center space-x-2 text-emerald-400 mb-1.5">
                <Shield className="w-4 h-4" />
                <span className="font-semibold text-sm font-serif text-white">Bug Bounty & AppSec</span>
              </div>
              <p className="text-zinc-400 leading-relaxed font-sans text-xs">
                Actively hunting web vulnerabilities on public bounty programs: deep-dives into IDORs,
                improper authorization boundaries, API leaks, and custom automated recon pipelines.
              </p>
            </div>

            {/* Pillar 2: AI Tooling */}
            <div className="p-4 rounded-lg bg-[#0d1017] border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center space-x-2 text-cyan-400 mb-1.5">
                <Cpu className="w-4 h-4" />
                <span className="font-semibold text-sm font-serif text-white">Autonomous AI Systems</span>
              </div>
              <p className="text-zinc-400 leading-relaxed font-sans text-xs">
                Developing intelligent agents that run toolchains autonomously. Integrating local LLMs with
                strict system prompt guardrails and behavioral feedback loops.
              </p>
            </div>

            {/* Pillar 3: Content (RootCause) */}
            <div className="p-4 rounded-lg bg-[#0d1017] border border-amber-500/20 hover:border-amber-500/40 transition-colors">
              <div className="flex items-center space-x-2 text-amber-400 mb-1.5">
                <BookOpen className="w-4 h-4" />
                <span className="font-semibold text-sm font-serif text-white">RootCause Media</span>
              </div>
              <p className="text-zinc-400 leading-relaxed font-sans text-xs">
                Creating high-density, faceless 60-second video breakdowns of critical zero-days, exploit
                chains, and software internals for the next generation of engineers.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Arsenal & Toolset Matrix */}
        <div id="skills-matrix" className="pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider">// ARSENAL & TOOLKIT</div>
              <h3 className="text-2xl font-serif text-white font-normal mt-1">Disciplines & Capabilities</h3>
            </div>

            {/* Tab Switches */}
            <div className="flex items-center space-x-1.5 bg-zinc-900/90 p-1 rounded-lg border border-white/10 font-mono text-xs">
              {SKILL_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.title}
                  onClick={() => setActiveSkillTab(idx)}
                  className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                    activeSkillTab === idx
                      ? 'bg-zinc-800 text-emerald-400 shadow-sm border border-emerald-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {idx === 0 ? 'Security' : idx === 1 ? 'AI / Systems' : 'Engineering'}
                </button>
              ))}
            </div>
          </div>

          {/* Active Skills Category Card */}
          <div className="rounded-xl bg-[#0c0f15] border border-white/10 p-5 sm:p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5 font-mono text-xs">
              <div className="flex items-center space-x-2 text-zinc-300">
                {activeSkillTab === 0 && <Shield className="w-4 h-4 text-emerald-400" />}
                {activeSkillTab === 1 && <Cpu className="w-4 h-4 text-cyan-400" />}
                {activeSkillTab === 2 && <Code className="w-4 h-4 text-amber-400" />}
                <span className="font-semibold text-sm text-white">
                  {SKILL_CATEGORIES[activeSkillTab].title}
                </span>
              </div>
              <span className="text-zinc-500 hidden sm:inline">
                {SKILL_CATEGORIES[activeSkillTab].description}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SKILL_CATEGORIES[activeSkillTab].skills.map((skill) => (
                <div
                  key={skill.name}
                  className="p-3 rounded-lg bg-zinc-900/50 border border-white/5 hover:border-white/15 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-medium text-zinc-200 group-hover:text-emerald-300 transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-emerald-400 border border-emerald-500/20">
                      {skill.proficiency}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors leading-relaxed">
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
