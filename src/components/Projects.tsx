import React, { useState } from 'react';
import {
  ExternalLink,
  Github,
  Sparkles,
  Zap,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Terminal,
  Play,
  RotateCcw,
  BookOpen,
  Feather,
  Cpu,
  Layers,
  Award,
} from 'lucide-react';
import { PROJECTS, PERSONAL_INFO } from '../data/portfolioData';
import { Project } from '../types';

export const Projects: React.FC = () => {
  // AETHOS Interactive Simulator State
  const [aethosXp, setAethosXp] = useState(650);
  const [aethosLevel, setAethosLevel] = useState(4);
  const [aethosStreak, setAethosStreak] = useState(12);
  const [aethosQuestDone, setAethosQuestDone] = useState(false);
  const [aceMessage, setAceMessage] = useState<string>(
    'System ready, VEX. High-load cognitive blocks scheduled for today. Maintain the streak.'
  );

  // RootCause Interactive Episode Selector
  const [activeEpisode, setActiveEpisode] = useState(0);
  const episodes = [
    {
      cve: 'CVE-2024-3094',
      title: 'XZ Utils Backdoor Anatomy',
      duration: '58s',
      views: '124K',
      takeaway: 'How a rogue maintainer hid multi-stage obfuscated payload in test tarballs to compromise OpenSSH.',
      terminalCode: 'if test -f ./tests/pkg_bad.tar.gz; then ld_preload_inject(); fi',
    },
    {
      cve: 'CVE-2023-38606',
      title: 'Operation Triangulation iOS Zero-Click',
      duration: '62s',
      views: '89K',
      takeaway: 'Exploiting undocumented hardware MMIO registers through iMessage attachments without user interaction.',
      terminalCode: '0x00002048 -> MMIO_PAGE_MAP_OVERRIDE -> KERNEL_R_W',
    },
    {
      cve: 'CWE-918',
      title: 'SSRF via Cloud Metadata (AWS / GCP)',
      duration: '45s',
      views: '150K',
      takeaway: 'Piercing perimeter filters to query 169.254.169.254 and exfiltrate temporary IAM role tokens.',
      terminalCode: 'curl -H "Metadata-Flavor: Google" http://169.254.169.254/computeMetadata/v1/',
    },
  ];

  // Inkwell Typographic Theme Selector
  const [inkwellFont, setInkwellFont] = useState<'serif' | 'mono' | 'sans'>('serif');
  const [inkwellText, setInkwellText] = useState<string>(
    `# The Art of First Principles\n\nSecurity is not an add-on feature. When writing software, every assumption is a future vulnerability. Keep your abstractions shallow and your data local.`
  );

  const handleCompleteQuest = () => {
    if (aethosQuestDone) return;
    const newXp = aethosXp + 150;
    setAethosXp(newXp);
    setAethosStreak((s) => s + 1);
    setAethosQuestDone(true);
    if (newXp >= 750) {
      setAethosLevel((lvl) => lvl + 1);
      setAceMessage('Level UP! Ace Analysis: Exceptional consistency. Neural focus index +14%.');
    } else {
      setAceMessage('Quest logged: +150 XP awarded. Streak multiplier active.');
    }
  };

  const handleResetAethos = () => {
    setAethosXp(650);
    setAethosLevel(4);
    setAethosStreak(12);
    setAethosQuestDone(false);
    setAceMessage('Simulation reset to default state. Ready for deployment.');
  };

  return (
    <section
      id="projects"
      className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-[#090b0e] relative"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center space-x-2 font-mono text-xs text-emerald-400 mb-3">
          <span className="text-zinc-600">//</span>
          <span>02. FEATURED PROJECTS</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
          <div>
            <h2
              id="projects-heading"
              className="text-3xl sm:text-5xl font-serif text-white font-normal tracking-tight"
            >
              Crafted Systems & Dissections
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 font-sans font-light max-w-2xl">
              Three signature initiatives blending cybersecurity principles, intelligent agents, and distraction-free software ergonomics.
            </p>
          </div>
          <div className="font-mono text-xs text-zinc-500 py-1.5">
            FILTER: 3 SIGNATURE WORKS
          </div>
        </div>

        {/* Project Entries */}
        <div className="space-y-16">
          {/* ========================================================== */}
          {/* PROJECT 1: AETHOS */}
          {/* ========================================================== */}
          <div
            id="project-aethos"
            className="rounded-2xl bg-[#0c0f16] border border-emerald-500/20 hover:border-emerald-500/40 transition-all p-6 sm:p-8 shadow-xl relative overflow-hidden"
          >
            {/* Top Badge & Category */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-white/5 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-semibold tracking-wide">
                  AETHOS
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400">AI & Self-Improvement</span>
              </div>
              <span className="text-zinc-500">CYBERPUNK PROTOCOL v2.4</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Info & Specs */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                  AETHOS — Gamified OS with AI Coach "Ace"
                </h3>
                <p className="text-zinc-300 font-sans text-sm sm:text-base leading-relaxed font-light">
                  A personal operating system wrapped in a dark cyberpunk aesthetic. AETHOS gamifies tasks,
                  habits, and deep reflection with an adaptive leveling loop and <span className="text-emerald-300 font-medium">Ace</span>,
                  an integrated AI coach that assesses your daily velocity, prevents burnout, and challenges rationalizations.
                </p>

                {/* Feature Bullet Points */}
                <div className="space-y-2 pt-1 font-mono text-xs text-zinc-300">
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-400 select-none">▸</span>
                    <span>Dynamic XP curve mechanics with streak multiplier bonuses</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-400 select-none">▸</span>
                    <span>AI Coach "Ace": conversational habit debriefs & cognitive analysis</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-400 select-none">▸</span>
                    <span>Offline-first zero telemetry architecture with encrypted client storage</span>
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['React 19', 'TypeScript', 'Tailwind', 'AI Coach Engine', 'Web Audio Synth'].map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="pt-4 flex items-center space-x-4 font-mono text-xs">
                  <a
                    href="https://github.com/vedwebsites-eng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                </div>
              </div>

              {/* Right Column: Live Interactive Cyberpunk Simulator */}
              <div className="lg:col-span-6">
                <div className="rounded-xl bg-[#080a0e] p-4 font-mono text-xs space-y-4 shadow-inner">
                  {/* Simulator Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-zinc-400 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400 font-semibold">AETHOS SIMULATOR</span>
                    </div>
                    <button
                      onClick={handleResetAethos}
                      className="text-zinc-500 hover:text-zinc-300 flex items-center space-x-1 transition-colors cursor-pointer"
                      title="Reset values"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>reset</span>
                    </button>
                  </div>

                  {/* Character Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-zinc-900/80">
                      <span className="text-[10px] text-zinc-500 block uppercase">Level</span>
                      <span className="text-base font-bold text-white">Lv. {aethosLevel}</span>
                    </div>
                    <div className="p-2 rounded bg-zinc-900/80">
                      <span className="text-[10px] text-zinc-500 block uppercase">Streak</span>
                      <span className="text-base font-bold text-amber-400 flex items-center justify-center space-x-1">
                        <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>{aethosStreak}d</span>
                      </span>
                    </div>
                    <div className="p-2 rounded bg-zinc-900/80">
                      <span className="text-[10px] text-zinc-500 block uppercase">XP Bar</span>
                      <span className="text-base font-bold text-emerald-400">{aethosXp} / 800</span>
                    </div>
                  </div>

                  {/* XP Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>PROGRESSION</span>
                      <span>{Math.round((aethosXp / 800) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${Math.min(100, (aethosXp / 800) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Ace AI Coach Dialogue Box */}
                  <div className="p-3 rounded bg-zinc-900/90 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-emerald-400 text-[11px] font-semibold">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>ACE [AI COACH]</span>
                    </div>
                    <p className="text-zinc-300 text-xs italic font-serif leading-relaxed">
                      "{aceMessage}"
                    </p>
                  </div>

                  {/* Interactive Quest Action */}
                  <div className="pt-1">
                    <button
                      onClick={handleCompleteQuest}
                      disabled={aethosQuestDone}
                      className={`w-full py-2.5 px-3 rounded text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                        aethosQuestDone
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        {aethosQuestDone
                          ? 'Daily Quest Completed (+150 XP)'
                          : 'Simulate Quest: "Complete Vulnerability Recon" (+150 XP)'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* PROJECT 2: RootCause */}
          {/* ========================================================== */}
          <div
            id="project-rootcause"
            className="rounded-2xl bg-[#0c0f16] border border-cyan-500/20 hover:border-cyan-500/40 transition-all p-6 sm:p-8 shadow-xl relative overflow-hidden"
          >
            {/* Top Badge & Category */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-white/5 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 font-semibold tracking-wide">
                  RootCause
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400">Cybersecurity Media & Research</span>
              </div>
              <span className="text-zinc-500">FACELESS DISSECTIONS</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Info & Specs */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                  RootCause — Faceless Tech & Cyber Dissections
                </h3>
                <p className="text-zinc-300 font-sans text-sm sm:text-base leading-relaxed font-light">
                  A high-velocity technical media channel breaking down critical zero-days, exploit chains,
                  and hacker methodology into 60-second visual explanations. Stripping away YouTube hype to
                  focus purely on assembly, memory corruption, and offensive-to-defensive takeaways.
                </p>

                {/* Bullets */}
                <div className="space-y-2 pt-1 font-mono text-xs text-zinc-300">
                  <div className="flex items-start space-x-2">
                    <span className="text-cyan-400 select-none">▸</span>
                    <span>Deconstructing historic CVEs (XZ Utils, Log4Shell, iOS zero-clicks)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-cyan-400 select-none">▸</span>
                    <span>Automated motion graphic workflow explaining packet and memory states</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-cyan-400 select-none">▸</span>
                    <span>Equipping software builders with real-world defensive engineering principles</span>
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['CVE Analysis', 'Burp Suite', 'Ghidra / Disassembly', 'Visual Storytelling', 'Shorts / Video Pipeline'].map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="pt-4 flex items-center space-x-4 font-mono text-xs">
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-cyan-400" />
                    <span>Watch Episodes on YouTube</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                </div>
              </div>

              {/* Right Column: Interactive Episode Reel */}
              <div className="lg:col-span-6">
                <div className="rounded-xl bg-[#080a0e] p-4 font-mono text-xs space-y-4 shadow-inner">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-zinc-400 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-cyan-400 font-semibold">CASE STUDY REEL</span>
                    </div>
                    <span className="text-zinc-500">CLICK TO INSPECT CVE</span>
                  </div>

                  {/* Episode Selector Tabs */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {episodes.map((ep, idx) => (
                      <button
                        key={ep.cve}
                        onClick={() => setActiveEpisode(idx)}
                        className={`p-2 rounded text-left transition-all cursor-pointer ${
                          activeEpisode === idx
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="text-[10px] text-zinc-500">{ep.cve}</div>
                        <div className="font-semibold text-xs truncate">{ep.title.split(' ')[0]}</div>
                      </button>
                    ))}
                  </div>

                  {/* Active Episode Card Breakdown */}
                  <div className="p-3.5 rounded bg-zinc-900/90 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white font-serif">
                        {episodes[activeEpisode].title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-cyan-400">
                        {episodes[activeEpisode].duration}
                      </span>
                    </div>

                    <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                      {episodes[activeEpisode].takeaway}
                    </p>

                    {/* Exploit Payload / Assembly snippet */}
                    <div className="bg-[#05070a] p-2.5 rounded text-[11px] font-mono text-emerald-400 overflow-x-auto">
                      <span className="text-zinc-500 select-none mr-2">$</span>
                      {episodes[activeEpisode].terminalCode}
                    </div>
                  </div>

                  {/* Metrics footer */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                    <span>FORMAT: 60s TECHNICAL SHORT</span>
                    <span className="text-zinc-400">ENGAGEMENT: HIGH-RETENTION</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* PROJECT 3: Inkwell */}
          {/* ========================================================== */}
          <div
            id="project-inkwell"
            className="rounded-2xl bg-[#0c0f16] border border-amber-500/20 hover:border-amber-500/40 transition-all p-6 sm:p-8 shadow-xl relative overflow-hidden"
          >
            {/* Top Badge & Category */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-white/5 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-semibold tracking-wide">
                  Inkwell
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400">Minimalist Note Engine</span>
              </div>
              <span className="text-zinc-500">TYPOGRAPHY FIRST</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Info & Specs */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                  Inkwell — Notes Crafted for Visual Bliss
                </h3>
                <p className="text-zinc-300 font-sans text-sm sm:text-base leading-relaxed font-light">
                  A markdown authoring engine built to make notes look undeniably elegant. Stripping out
                  clunky dashboards and database layers in favor of pure typography, optimal line measures,
                  instant keyboard navigation, and local-first persistence.
                </p>

                {/* Bullets */}
                <div className="space-y-2 pt-1 font-mono text-xs text-zinc-300">
                  <div className="flex items-start space-x-2">
                    <span className="text-amber-400 select-none">▸</span>
                    <span>Editorial typography pairing with optimal 65ch line measure</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-amber-400 select-none">▸</span>
                    <span>Pure markdown rendering with live preview and keyboard shortcuts</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-amber-400 select-none">▸</span>
                    <span>Clean print & export engine to high-resolution PDF or static HTML</span>
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['React', 'TypeScript', 'Tailwind', 'Markdown Engine', 'Typography Presets', 'LocalStorage'].map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="pt-4 flex items-center space-x-4 font-mono text-xs">
                  <a
                    href="https://github.com/vedwebsites-eng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                </div>
              </div>

              {/* Right Column: Live Typographic Note Canvas */}
              <div className="lg:col-span-6">
                <div className="rounded-xl bg-[#080a0e] p-4 font-mono text-xs space-y-3 shadow-inner">
                  {/* Canvas Header & Font Switcher */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-zinc-400 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <Feather className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-amber-400 font-semibold">TYPOGRAPHY CANVAS</span>
                    </div>

                    <div className="flex items-center space-x-1 bg-zinc-900 p-0.5 rounded">
                      <button
                        onClick={() => setInkwellFont('serif')}
                        className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                          inkwellFont === 'serif' ? 'bg-zinc-800 text-amber-300' : 'text-zinc-500'
                        }`}
                      >
                        Serif
                      </button>
                      <button
                        onClick={() => setInkwellFont('mono')}
                        className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                          inkwellFont === 'mono' ? 'bg-zinc-800 text-amber-300' : 'text-zinc-500'
                        }`}
                      >
                        Mono
                      </button>
                      <button
                        onClick={() => setInkwellFont('sans')}
                        className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                          inkwellFont === 'sans' ? 'bg-zinc-800 text-amber-300' : 'text-zinc-500'
                        }`}
                      >
                        Sans
                      </button>
                    </div>
                  </div>

                  {/* Rendered Note Preview */}
                  <div
                    className={`p-4 rounded bg-[#0d1017] min-h-[160px] ${
                      inkwellFont === 'serif'
                        ? 'font-serif'
                        : inkwellFont === 'mono'
                        ? 'font-mono'
                        : 'font-sans'
                    }`}
                  >
                    <div className="text-amber-200/90 text-xl font-normal mb-2 tracking-tight">
                      The Art of First Principles
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed mb-3">
                      Security is not an add-on feature. When writing software, every assumption is a
                      future vulnerability. Keep your abstractions shallow and your data local.
                    </p>
                    <div className="border-l-2 border-amber-500/40 pl-3 text-zinc-400 italic text-xs">
                      "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."
                    </div>
                  </div>

                  {/* Canvas stats footer */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
                    <span>AUTOSAVED TO LOCAL STORAGE</span>
                    <span>65ch MEASURE • ZERO LAG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
