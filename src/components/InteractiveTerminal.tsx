import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, CornerDownLeft, Sparkles, X, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS } from '../data/portfolioData';

interface InteractiveTerminalProps {
  isModal?: boolean;
  onClose?: () => void;
  onOpenResume?: () => void;
  onNavigate404?: () => void;
}

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({
  isModal = false,
  onClose,
  onOpenResume,
  onNavigate404,
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ command: string; output: React.ReactNode; isError?: boolean }>>([
    {
      command: 'init --session',
      output: (
        <div className="space-y-1 text-zinc-300">
          <div className="text-emerald-400 font-semibold">
            VEX Terminal Interface v2.6.4 [Pune Node]
          </div>
          <div>Type <span className="text-cyan-300 font-semibold">'help'</span> to see all available commands, or click the command chips below.</div>
          <div className="text-zinc-500 text-[11px]">Identity: Vedant Sattegiri Patil • 15 y/o • Cybersecurity &times; AI &times; Systems</div>
        </div>
      ),
    },
  ]);

  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>(['help']);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;

    const cmd = raw.toLowerCase();
    setCommandHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    let resultOutput: React.ReactNode = null;
    let isErr = false;

    switch (cmd) {
      case 'help':
        resultOutput = (
          <div className="space-y-1.5 text-zinc-300">
            <div className="text-emerald-400 font-semibold mb-1">AVAILABLE COMMANDS:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
              <div><span className="text-cyan-300 font-semibold">whoami</span> — Profile, age & background</div>
              <div><span className="text-cyan-300 font-semibold">projects</span> — List signature works</div>
              <div><span className="text-cyan-300 font-semibold">aethos</span> — Deep-dive into AETHOS</div>
              <div><span className="text-cyan-300 font-semibold">rootcause</span> — YouTube channel details</div>
              <div><span className="text-cyan-300 font-semibold">inkwell</span> — Minimal note app specs</div>
              <div><span className="text-cyan-300 font-semibold">skills</span> — AppSec & AI arsenal</div>
              <div><span className="text-cyan-300 font-semibold">contact</span> — Reach out via email/GitHub</div>
              <div><span className="text-cyan-300 font-semibold">gmail</span> — Google Workspace email API</div>
              <div><span className="text-cyan-300 font-semibold">resume</span> — Open full curriculum vitae</div>
              <div><span className="text-cyan-300 font-semibold">pgp</span> — View cryptographic key</div>
              <div><span className="text-cyan-300 font-semibold">date</span> — Display local Pune (IST) time</div>
              <div><span className="text-cyan-300 font-semibold">clear</span> — Wipe terminal viewport</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        resultOutput = (
          <div className="space-y-1 text-zinc-300">
            <div className="text-white font-semibold">Vedant Sattegiri Patil (VEX)</div>
            <div>• Age: 15 years old • High school student-builder</div>
            <div>• Base: Pune, Maharashtra, India</div>
            <div>• Dual Discipline: Offensive AppSec / Bug Bounty &times; Autonomous AI Systems</div>
            <div className="text-zinc-400 pt-1">
              "Fascinated by system boundaries, reverse engineering, and shipping software with zero fluff."
            </div>
          </div>
        );
        break;

      case 'projects':
        resultOutput = (
          <div className="space-y-2 text-zinc-300">
            <div className="text-emerald-400 font-semibold">PROJECT MANIFEST:</div>
            <div className="space-y-1.5">
              <div>
                <span className="text-emerald-300 font-bold">[1] AETHOS</span> — Cyberpunk gamified OS with AI coach 'Ace' (React, TS, AI Agent)
              </div>
              <div>
                <span className="text-cyan-300 font-bold">[2] RootCause</span> — Faceless tech & cybersecurity channel breaking down CVEs in 60s
              </div>
              <div>
                <span className="text-amber-300 font-bold">[3] Inkwell</span> — Distraction-free typographic note engine (Editorial serif, zero lag)
              </div>
            </div>
            <div className="text-zinc-500 text-[11px] pt-1">
              Tip: Type 'aethos', 'rootcause', or 'inkwell' for individual project specs.
            </div>
          </div>
        );
        break;

      case 'aethos':
        resultOutput = (
          <div className="space-y-1 text-zinc-300">
            <div className="text-emerald-400 font-semibold">AETHOS // CYBERPUNK SELF-IMPROVEMENT</div>
            <div>Category: AI & Personal Productivity</div>
            <div>Features: Dual-engine questlines, adaptive XP curve, behavioral streak protection</div>
            <div>AI Coach: Ace (contextual daily debriefs & cognitive load analysis)</div>
            <div>Stack: React 19, TypeScript, Tailwind, Web Audio synth, LocalStorage</div>
          </div>
        );
        break;

      case 'rootcause':
        resultOutput = (
          <div className="space-y-1 text-zinc-300">
            <div className="text-cyan-400 font-semibold">RootCause // FACELESS CYBERSECURITY MEDIA</div>
            <div>Focus: Byte-level exploit dissections & defensive software architecture</div>
            <div>Pillars: CVE-2024-3094, Memory corruption, iOS zero-clicks, SSRF chains</div>
            <div>Format: High-density 60s animated shorts for builders and hackers</div>
          </div>
        );
        break;

      case 'inkwell':
        resultOutput = (
          <div className="space-y-1 text-zinc-300">
            <div className="text-amber-400 font-semibold">Inkwell // DISTRACTION-FREE TYPOGRAPHIC CANVAS</div>
            <div>Design: Newsreader & Playfair editorial typography, optimal 65ch line measure</div>
            <div>Philosophy: Zero bloat, instant local persistence, beautiful print/export</div>
            <div>Stack: React, Markdown parser, Keyboard-driven shortcuts</div>
          </div>
        );
        break;

      case 'skills':
        resultOutput = (
          <div className="space-y-2 text-zinc-300">
            <div className="text-emerald-400 font-semibold">SECURITY & TECH ARSENAL:</div>
            <div>• <span className="text-emerald-300">Offensive Security:</span> Burp Suite, Web Pentesting (OWASP), Recon scripts, IDORs, SSRF</div>
            <div>• <span className="text-cyan-300">AI Systems:</span> Tool-use agents, Local LLMs, Prompt engineering, ReAct loops</div>
            <div>• <span className="text-amber-300">Languages & Tools:</span> TypeScript, Python, React, Tailwind, Linux/Bash, Git, Wireshark</div>
          </div>
        );
        break;

      case 'contact':
        resultOutput = (
          <div className="space-y-1.5 text-zinc-300">
            <div className="text-emerald-400 font-semibold">COMMUNICATION CHANNELS:</div>
            <div>• <span className="text-emerald-300 font-medium">Personal & Research:</span> <a href={`mailto:${PERSONAL_INFO.personalEmail}`} className="text-cyan-300 underline">{PERSONAL_INFO.personalEmail}</a></div>
            <div>• <span className="text-cyan-300 font-medium">Work & Enterprise:</span> <a href={`mailto:${PERSONAL_INFO.workEmail}`} className="text-cyan-300 underline">{PERSONAL_INFO.workEmail}</a></div>
            <div>• <span className="text-purple-300 font-medium">GitHub:</span> <a href={PERSONAL_INFO.githubUrl} target="_blank" rel="noreferrer" className="text-cyan-300 underline">{PERSONAL_INFO.githubUrl}</a></div>
            <div>• <span className="text-amber-300 font-medium">Gmail API Console:</span> Run <span className="text-emerald-300 font-semibold">'gmail'</span> to launch direct Workspace transmission.</div>
          </div>
        );
        break;

      case 'gmail':
        resultOutput = (
          <div className="space-y-2 text-zinc-300">
            <div className="text-emerald-400 font-semibold flex items-center space-x-1.5">
              <span>GMAIL WORKSPACE INTEGRATION CONSOLE</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <div>• <span className="text-white">API Gateway:</span> Google Workspace Gmail REST API (v1)</div>
            <div>• <span className="text-white">Target Inboxes:</span></div>
            <div className="pl-3 space-y-0.5 text-[11px]">
              <div>1. <span className="text-emerald-300">{PERSONAL_INFO.personalEmail}</span> (Personal & CVE Disclosures)</div>
              <div>2. <span className="text-cyan-300">{PERSONAL_INFO.workEmail}</span> (Work & Enterprise Inquiries)</div>
            </div>
            <div>• <span className="text-white">Security:</span> RFC 2822 formatting + Mandatory User Confirmation dialog</div>
            <div className="pt-1">
              <a
                href="#contact"
                className="inline-block px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] hover:bg-emerald-500/30 transition-colors"
              >
                &rarr; Jump to Live Gmail Transmission Console
              </a>
            </div>
          </div>
        );
        break;

      case 'resume':
        if (onOpenResume) {
          onOpenResume();
          resultOutput = <div className="text-emerald-400">Opening Curriculum Vitae modal...</div>;
        } else {
          resultOutput = <div className="text-zinc-300">Resume viewer dispatched. Scroll to resume section.</div>;
        }
        break;

      case 'pgp':
        resultOutput = (
          <div className="space-y-1 text-zinc-300 font-mono text-[11px]">
            <div className="text-emerald-400 font-semibold">VERIFIED PGP FINGERPRINT:</div>
            <div className="bg-black/50 p-2 rounded border border-white/10 text-cyan-300 select-all">
              {PERSONAL_INFO.pgpFingerprint}
            </div>
            <div className="text-zinc-500">Key ID: 0x61D94AA1 [VEX Security Research]</div>
          </div>
        );
        break;

      case '404':
        if (onNavigate404) {
          onNavigate404();
          resultOutput = <div className="text-rose-400">Triggering route simulation: /404...</div>;
        } else {
          resultOutput = <div className="text-zinc-400">Navigating to /404 endpoint.</div>;
        }
        break;

      case 'date':
        resultOutput = (
          <div className="text-zinc-300">
            Current Pune Time: <span className="text-emerald-400">{new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'sudo':
        resultOutput = (
          <div className="text-red-400">
            [sudo] guest is not in the sudoers file. This incident has been logged and reported to VEX.
          </div>
        );
        isErr = true;
        break;

      default:
        resultOutput = (
          <div className="text-zinc-400">
            command not found: <span className="text-red-400">{cmd}</span>. Type <span className="text-cyan-300 font-semibold">'help'</span> for a list of commands.
          </div>
        );
        isErr = true;
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        command: raw,
        output: resultOutput,
        isError: isErr,
      },
    ]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[commandHistory.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[commandHistory.length - 1 - nextIdx] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const quickChips = ['help', 'whoami', 'projects', 'gmail', 'skills', 'contact', 'resume', 'clear'];

  const content = (
    <div className="flex flex-col h-full bg-[#080b0f] text-zinc-300 font-mono text-xs rounded-xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d1017] border-b border-white/10 select-none">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-zinc-400 font-medium ml-2 text-xs">vex@pune:~ (interactive shell)</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleCommand('clear')}
            className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors cursor-pointer"
            title="Clear terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white p-1 transition-colors cursor-pointer"
              title="Close terminal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Log Output Area */}
      <div
        className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 font-mono text-xs leading-relaxed"
        style={{ minHeight: isModal ? '380px' : '280px', maxHeight: isModal ? '550px' : '400px' }}
      >
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center space-x-2 text-zinc-400">
              <span className="text-emerald-400 select-none">vex@pune:~$</span>
              <span className="text-white font-medium">{item.command}</span>
            </div>
            <div className="pl-4 text-zinc-300 border-l border-white/5 py-0.5">
              {item.output}
            </div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Quick Clickable Command Chips */}
      <div className="px-4 py-2 bg-[#0a0d12] border-t border-white/5 flex flex-wrap items-center gap-1.5 select-none">
        <span className="text-[10px] text-zinc-500 mr-1">// CHIPS:</span>
        {quickChips.map((chip) => (
          <button
            key={chip}
            onClick={() => handleCommand(chip)}
            className="px-2 py-0.5 rounded bg-zinc-900/90 text-zinc-400 hover:text-emerald-300 hover:border-emerald-500/30 border border-white/5 text-[11px] transition-all cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Prompt Field */}
      <div className="flex items-center px-4 py-3 bg-[#0d1017] border-t border-white/10">
        <span className="text-emerald-400 font-semibold select-none mr-2">vex@pune:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command ('help', 'projects', 'whoami')..."
          className="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono placeholder:text-zinc-600"
          autoFocus={isModal}
        />
        <button
          onClick={() => handleCommand(input)}
          className="text-zinc-400 hover:text-emerald-400 p-1 cursor-pointer transition-colors ml-2"
          title="Submit command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  // If used as modal
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
          {content}
        </div>
      </div>
    );
  }

  // If embedded in the page
  return (
    <section id="terminal" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-[#090b0e]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center space-x-2 font-mono text-xs text-cyan-400 mb-3">
          <span className="text-zinc-600">//</span>
          <span>03. INTERACTIVE COMMAND LINE</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-normal tracking-tight">
              Direct System Shell
            </h2>
            <p className="text-zinc-400 text-sm mt-1 font-sans font-light">
              Explore my background, project telemetry, and security notes directly through the terminal.
            </p>
          </div>
          <div className="font-mono text-xs text-zinc-500">
            PRESS <span className="text-zinc-300 font-semibold px-1 py-0.5 rounded bg-zinc-800 border border-white/10">ENTER</span> TO EXECUTE
          </div>
        </div>

        {content}
      </div>
    </section>
  );
};
