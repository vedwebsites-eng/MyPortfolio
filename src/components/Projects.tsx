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
  PenTool,
  Video,
} from 'lucide-react';
import { PROJECTS, PERSONAL_INFO } from '../data/portfolioData';
import { GitHubLiveStat } from './GitHubLiveStat';

export const Projects: React.FC = () => {
  // AETHOS Interactive Simulator State
  const [aethosXp, setAethosXp] = useState(650);
  const [aethosLevel, setAethosLevel] = useState(4);
  const [aethosStreak, setAethosStreak] = useState(12);
  const [aethosQuestDone, setAethosQuestDone] = useState(false);
  const [aceMessage, setAceMessage] = useState<string>(
    'System ready, VEX. High-load cognitive blocks scheduled for today. Maintain the streak.'
  );

  // Inkwell Interactive Typographic State
  const [inkwellFont, setInkwellFont] = useState<'serif' | 'mono' | 'sans'>('serif');
  const [activeHighlight, setActiveHighlight] = useState<'yellow' | 'mint' | 'pink' | 'sky'>('yellow');

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

  const highlightStyles = {
    yellow: 'bg-[#fef08a]/80 text-amber-950 px-1 py-0.5 rounded-[2px_5px_3px_4px]',
    mint: 'bg-[#bbf7d0]/80 text-emerald-950 px-1 py-0.5 rounded-[5px_2px_4px_3px]',
    pink: 'bg-[#fbcfe8]/80 text-rose-950 px-1 py-0.5 rounded-[3px_5px_2px_4px]',
    sky: 'bg-[#bae6fd]/80 text-sky-950 px-1 py-0.5 rounded-[4px_2px_5px_3px]',
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
          <span>02. PROJECTS</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
          <div>
            <h2
              id="projects-heading"
              className="text-3xl sm:text-5xl font-serif text-white font-normal tracking-tight"
            >
              Projects
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 font-sans font-light max-w-2xl">
              Security, AI, and software — built and shipped.
            </p>
          </div>
          <div className="font-mono text-xs text-zinc-500 py-1.5">
            FILTER: 3 SIGNATURE WORKS
          </div>
        </div>

        {/* Project Entries */}
        <div className="space-y-16">
          {/* ========================================================== */}
          {/* PROJECT 1: AETHOS CARD */}
          {/* ========================================================== */}
          <div
            id="project-aethos"
            className="rounded-2xl bg-[#050505] border border-[#FF4500]/40 hover:border-[#FF4500]/70 transition-all p-6 sm:p-8 shadow-[0_0_28px_rgba(255,69,0,0.12)] hover:shadow-[0_0_42px_rgba(255,69,0,0.22)] relative overflow-hidden"
          >
            {/* Subtle scanline and cyber-grid background texture */}
            <div className="pointer-events-none absolute inset-0 cyber-grid-texture opacity-30" />
            <div className="pointer-events-none absolute inset-0 scanline-texture opacity-20" />

            {/* Top Badge & Category */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-white/10 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-[#FF4500]/15 text-[#FF4500] font-semibold tracking-wide border border-[#FF4500]/30">
                  AETHOS
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400 font-space">AI & Self-Improvement OS</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-[#00D9FF]/10 text-[#00D9FF] text-[11px] border border-[#00D9FF]/20">
                  CYAN SEC v2.4
                </span>
                <span className="text-zinc-500 font-mono">PROTOCOL ACTIVE</span>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Info & Specs */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight text-glow-orange">
                  AETHOS
                </h3>
                <p className="text-zinc-300 font-space text-sm sm:text-base leading-relaxed font-light">
                  A personal operating system wrapped in a dark cyberpunk aesthetic. AETHOS gamifies tasks,
                  habits, and deep reflection with an adaptive leveling loop and{' '}
                  <span className="text-[#00D9FF] font-medium">Ace</span>, an integrated AI coach that assesses
                  daily velocity, challenges rationalizations, and shields your deep-work flow.
                </p>

                {/* Feature Bullet Points */}
                <div className="space-y-2 pt-1 font-space text-xs text-zinc-300">
                  <div className="flex items-start space-x-2">
                    <span className="text-[#FF4500] font-bold select-none">▸</span>
                    <span>Dynamic XP curve mechanics with streak multiplier bonuses & level ceilings</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-[#00D9FF] font-bold select-none">▸</span>
                    <span>AI Coach "Ace": conversational habit debriefs & cognitive performance heuristics</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-[#FF4500] font-bold select-none">▸</span>
                    <span>Offline-first zero telemetry architecture with encrypted client-side local persistence</span>
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['React 19', 'TypeScript', 'Tailwind', 'AI Coach Engine', 'Web Audio Synth', 'Encrypted State'].map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#111111] text-zinc-400 border border-white/5"
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
                    className="inline-flex items-center space-x-1.5 text-[#FF4500] hover:text-amber-400 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                </div>
              </div>

              {/* Right Column: Glass-Style Inner Stats Panel */}
              <div className="lg:col-span-6">
                <div className="rounded-xl bg-[#090b10]/60 backdrop-blur-md border border-[#FF4500]/25 p-5 font-space text-xs space-y-4 shadow-2xl">
                  {/* Simulator Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-zinc-400 text-[11px] font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse" />
                      <span className="text-[#FF4500] font-semibold">AETHOS SIMULATOR</span>
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
                    <div className="p-2.5 rounded bg-white/[0.03] backdrop-blur-sm border border-white/5">
                      <span className="text-[10px] text-zinc-400 block uppercase font-mono">Level</span>
                      <span className="text-base font-bold text-white font-mono">Lv. {aethosLevel}</span>
                    </div>
                    <div className="p-2.5 rounded bg-white/[0.03] backdrop-blur-sm border border-white/5">
                      <span className="text-[10px] text-zinc-400 block uppercase font-mono">Streak</span>
                      <span className="text-base font-bold text-amber-400 flex items-center justify-center space-x-1 font-mono">
                        <Flame className="w-4 h-4 text-[#FF4500] fill-[#FF4500]" />
                        <span>{aethosStreak}d</span>
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-white/[0.03] backdrop-blur-sm border border-white/5">
                      <span className="text-[10px] text-zinc-400 block uppercase font-mono">XP Bar</span>
                      <span className="text-base font-bold text-[#00D9FF] font-mono">{aethosXp} / 800</span>
                    </div>
                  </div>

                  {/* XP Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                      <span>PROGRESSION</span>
                      <span className="text-[#00D9FF]">{Math.round((aethosXp / 800) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF4500] via-amber-500 to-[#00D9FF] transition-all duration-500"
                        style={{ width: `${Math.min(100, (aethosXp / 800) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Ace AI Coach Dialogue Box */}
                  <div className="p-3.5 rounded bg-white/[0.02] border border-white/5 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-[#00D9FF] text-[11px] font-semibold font-mono">
                      <Cpu className="w-3.5 h-3.5 text-[#00D9FF]" />
                      <span>ACE [AI COACH]</span>
                    </div>
                    <p className="text-zinc-200 text-xs italic font-serif leading-relaxed">
                      "{aceMessage}"
                    </p>
                  </div>

                  {/* Interactive Quest Action */}
                  <div className="pt-1">
                    <button
                      onClick={handleCompleteQuest}
                      disabled={aethosQuestDone}
                      className={`w-full py-2.5 px-3 rounded text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer font-space ${
                        aethosQuestDone
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                          : 'bg-[#FF4500]/20 hover:bg-[#FF4500]/30 text-amber-200 border border-[#FF4500]/40 shadow-lg shadow-[#FF4500]/10'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-[#FF4500]" />
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
          {/* PROJECT 2: INKWELL CARD (Warm Paper Insert) */}
          {/* ========================================================== */}
          <div
            id="project-inkwell"
            className="rounded-2xl bg-[#0d0f15] border border-stone-800/80 p-2.5 sm:p-3.5 shadow-xl relative overflow-hidden transition-all"
          >
            {/* The CARD CONTENT area inside feels like inserted paper */}
            <div className="rounded-xl bg-[#faf7f2] sm:bg-stone-50 text-stone-900 p-6 sm:p-8 shadow-2xl relative border border-stone-200/90 overflow-hidden">
              {/* Top Bar on Paper */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-stone-200 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-600 font-semibold font-mono text-[11px] tracking-wide border border-rose-500/20">
                    INKWELL
                  </span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-600 font-serif italic text-sm">
                    Distraction-Free Markdown Engine
                  </span>
                </div>

                {/* Highlighter Swatches as irregular-border-radius chips */}
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-mono text-stone-500 mr-1">SWATCHES:</span>
                  <button
                    onClick={() => setActiveHighlight('yellow')}
                    className={`cursor-pointer transition-transform ${
                      activeHighlight === 'yellow' ? 'scale-110 ring-2 ring-amber-400 ring-offset-1' : 'opacity-80'
                    }`}
                    title="Pastel Yellow Highlighter"
                  >
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-[#fef08a] text-amber-950 rounded-[3px_7px_4px_6px] shadow-sm">
                      yellow
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveHighlight('mint')}
                    className={`cursor-pointer transition-transform ${
                      activeHighlight === 'mint' ? 'scale-110 ring-2 ring-emerald-400 ring-offset-1' : 'opacity-80'
                    }`}
                    title="Pastel Mint Highlighter"
                  >
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-[#bbf7d0] text-emerald-950 rounded-[6px_3px_5px_4px] shadow-sm">
                      mint
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveHighlight('pink')}
                    className={`cursor-pointer transition-transform ${
                      activeHighlight === 'pink' ? 'scale-110 ring-2 ring-rose-400 ring-offset-1' : 'opacity-80'
                    }`}
                    title="Pastel Pink Highlighter"
                  >
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-[#fbcfe8] text-rose-950 rounded-[4px_6px_3px_7px] shadow-sm">
                      pink
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveHighlight('sky')}
                    className={`cursor-pointer transition-transform ${
                      activeHighlight === 'sky' ? 'scale-110 ring-2 ring-sky-400 ring-offset-1' : 'opacity-80'
                    }`}
                    title="Pastel Sky Highlighter"
                  >
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-[#bae6fd] text-sky-950 rounded-[5px_3px_6px_4px] shadow-sm">
                      sky
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Info & Specs */}
                <div className="lg:col-span-6 space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-serif italic text-stone-900 font-normal tracking-tight">
                    Inkwell
                  </h3>
                  <p className="text-stone-800 font-lora text-sm sm:text-base leading-relaxed">
                    A markdown authoring engine built to make thoughts look undeniably elegant on digital paper.
                    Inkwell removes heavy cloud infrastructure and cluttered navigation, focusing entirely on
                    optical typography, optimal 65ch line measures, pastel highlighter brushes, and instant local-first persistence.
                  </p>

                  {/* Bullets */}
                  <div className="space-y-2 pt-1 font-lora text-xs text-stone-800">
                    <div className="flex items-start space-x-2">
                      <span className="text-rose-500 select-none">❧</span>
                      <span>Editorial typography pairing with optimal 65ch measure to minimize reading fatigue</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-rose-500 select-none">❧</span>
                      <span>Tactile pastel highlighters with organic irregular edges for intuitive note annotation</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-rose-500 select-none">❧</span>
                      <span>Offline-first local markdown storage with zero telemetry or network dependencies</span>
                    </div>
                  </div>

                  {/* Tech Stack Chips on Paper */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {['React 19', 'TypeScript', 'Tailwind', 'Markdown Engine', 'Typography Presets', 'LocalStorage'].map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-stone-200/70 text-stone-700 border border-stone-300/60"
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
                      className="inline-flex items-center space-x-1.5 text-rose-600 hover:text-rose-700 transition-colors font-medium"
                    >
                      <Github className="w-4 h-4" />
                      <span>View Repository</span>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </a>
                  </div>
                </div>

                {/* Right Column: Live Typographic Note Canvas on Paper */}
                <div className="lg:col-span-6">
                  <div className="rounded-xl bg-white p-5 text-xs space-y-3 shadow-md border border-stone-200/90">
                    {/* Canvas Header & Font Switcher */}
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200 text-stone-600 text-[11px] font-mono">
                      <div className="flex items-center space-x-2">
                        <PenTool className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-rose-600 font-semibold">INKWELL CANVAS</span>
                      </div>

                      <div className="flex items-center space-x-1 bg-stone-100 p-0.5 rounded border border-stone-200">
                        <button
                          onClick={() => setInkwellFont('serif')}
                          className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                            inkwellFont === 'serif' ? 'bg-stone-900 text-stone-100 font-medium' : 'text-stone-600'
                          }`}
                        >
                          Serif
                        </button>
                        <button
                          onClick={() => setInkwellFont('mono')}
                          className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                            inkwellFont === 'mono' ? 'bg-stone-900 text-stone-100 font-medium' : 'text-stone-600'
                          }`}
                        >
                          Mono
                        </button>
                        <button
                          onClick={() => setInkwellFont('sans')}
                          className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                            inkwellFont === 'sans' ? 'bg-stone-900 text-stone-100 font-medium' : 'text-stone-600'
                          }`}
                        >
                          Sans
                        </button>
                      </div>
                    </div>

                    {/* Rendered Note Preview on Paper */}
                    <div
                      className={`p-4 rounded-lg bg-[#faf7f2] min-h-[160px] border border-stone-200/70 text-stone-900 ${
                        inkwellFont === 'serif'
                          ? 'font-lora'
                          : inkwellFont === 'mono'
                          ? 'font-mono'
                          : 'font-space'
                      }`}
                    >
                      <div className="text-stone-900 text-lg font-serif italic mb-2 tracking-tight">
                        The Art of First Principles
                      </div>
                      <p className="text-stone-800 text-xs sm:text-sm leading-relaxed mb-3">
                        Security is not an add-on feature.{' '}
                        <span className={highlightStyles[activeHighlight]}>
                          When writing software, every assumption is a future vulnerability.
                        </span>{' '}
                        Keep your abstractions shallow and your data local.
                      </p>
                      <div className="border-l-2 border-rose-400 pl-3 text-stone-600 italic text-xs font-lora">
                        "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."
                      </div>
                    </div>

                    {/* Canvas stats footer */}
                    <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono pt-1">
                      <span>AUTOSAVED TO LOCAL STORAGE</span>
                      <span className="text-rose-600">65ch MEASURE • ZERO TELEMETRY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* PROJECT 3: ROOTCAUSE CARD (Dark Terminal, In The Grind) */}
          {/* ========================================================== */}
          <div
            id="project-rootcause"
            className="rounded-2xl bg-[#080b10] border border-cyan-500/25 hover:border-cyan-500/50 transition-all p-6 sm:p-8 shadow-xl relative overflow-hidden"
          >
            {/* Top Badge & Category */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-white/5 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 font-semibold tracking-wide border border-cyan-500/30">
                  ROOTCAUSE
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">Faceless Tech & Cyber Media</span>
              </div>

              {/* Large Status Label */}
              <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-mono font-bold tracking-wider text-[11px]">
                  STATUS: IN THE GRIND
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Info & Specs */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                  RootCause
                </h3>

                {/* Explicit one-line subtext */}
                <p className="text-cyan-300/90 font-mono text-xs sm:text-sm font-medium">
                  faceless tech/cybersecurity shorts channel, building in public
                </p>

                <p className="text-zinc-300 font-sans text-sm sm:text-base leading-relaxed font-light">
                  A high-velocity technical media channel breaking down critical zero-days, exploit chains,
                  and hacker methodology into 60-second visual explanations. Stripping away YouTube hype to
                  focus purely on assembly, memory corruption, and offensive-to-defensive takeaways.
                </p>

                {/* Bullets */}
                <div className="space-y-2 pt-1 font-mono text-xs text-zinc-300">
                  <div className="flex items-start space-x-2">
                    <span className="text-cyan-400 select-none">▸</span>
                    <span>Deconstructing historic CVEs (XZ Utils backdoor, Log4Shell, iOS zero-clicks)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-cyan-400 select-none">▸</span>
                    <span>Kinetic motion graphic pipelines converting memory buffers into visual reels</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-cyan-400 select-none">▸</span>
                    <span>Building in public: from Ghidra disassembly scripts to final 4K vertical exports</span>
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['CVE Analysis', 'Burp Suite', 'Ghidra / Disassembly', 'Kinetic Typography', 'Vertical Shorts Pipeline'].map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-400 border border-white/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links / Teaser */}
                <div className="pt-4 flex items-center space-x-4 font-mono text-xs">
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-cyan-400" />
                    <span>Watch Channel Teaser</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                  <span className="text-zinc-500">LAUNCHING Q3 2026</span>
                </div>
              </div>

              {/* Right Column: Fake Progress Bar & Terminal Stream with Blinking Cursor */}
              <div className="lg:col-span-6">
                <div className="rounded-xl bg-[#06080d] p-4 sm:p-5 font-mono text-xs space-y-4 shadow-inner border border-white/5">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-zinc-400 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-cyan-400 font-semibold">PRODUCTION PIPELINE</span>
                    </div>
                    <span className="text-amber-400 font-mono">RENDERING QUEUE</span>
                  </div>

                  {/* Fake Progress Bar for Texture */}
                  <div className="space-y-1.5 bg-[#0a0e16] p-3 rounded-lg border border-white/5">
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>PIPELINE: 68% REEL COMPILED</span>
                      <span className="text-cyan-400 font-semibold">[█████████████░░░░]</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 w-[68%]" />
                    </div>
                  </div>

                  {/* Episode Selector Tabs */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {episodes.map((ep, idx) => (
                      <button
                        key={ep.cve}
                        onClick={() => setActiveEpisode(idx)}
                        className={`p-2 rounded text-left transition-all cursor-pointer ${
                          activeEpisode === idx
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-white/5'
                        }`}
                      >
                        <div className="text-[10px] text-zinc-500">{ep.cve}</div>
                        <div className="font-semibold text-xs truncate">{ep.title.split(' ')[0]}</div>
                      </button>
                    ))}
                  </div>

                  {/* Active Episode Card Breakdown with Blinking Cursor */}
                  <div className="p-3.5 rounded bg-zinc-900/90 space-y-2.5 border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white font-serif">
                        {episodes[activeEpisode].title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-cyan-400 border border-cyan-500/20">
                        {episodes[activeEpisode].duration}
                      </span>
                    </div>

                    <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                      {episodes[activeEpisode].takeaway}
                    </p>

                    {/* Exploit Payload with Blinking Cursor */}
                    <div className="bg-[#05070a] p-2.5 rounded text-[11px] font-mono text-emerald-400 overflow-x-auto flex items-center">
                      <span className="text-zinc-500 select-none mr-2">$</span>
                      <span>{episodes[activeEpisode].terminalCode}</span>
                      <span className="inline-block w-2 h-3.5 bg-emerald-400 ml-1.5 animate-pulse">
                        _
                      </span>
                    </div>
                  </div>

                  {/* Metrics footer */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                    <span>FORMAT: 60s KINETIC TECHNICAL REELS</span>
                    <span className="text-cyan-400 font-mono">BUILDING IN PUBLIC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live GitHub Stats Pulse for @vedwebsites-eng */}
        <GitHubLiveStat />
      </div>
    </section>
  );
};
