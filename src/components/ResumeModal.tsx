import React, { useState } from 'react';
import { X, Download, Printer, Copy, Check, FileText, ExternalLink, Shield, Cpu, Code } from 'lucide-react';
import { RESUME_DATA, PROJECTS, PERSONAL_INFO } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const plainText = `
${RESUME_DATA.name} (${RESUME_DATA.handle})
${RESUME_DATA.title}
Location: ${RESUME_DATA.location}
Email: ${RESUME_DATA.email}
GitHub: ${RESUME_DATA.github}

SUMMARY:
${RESUME_DATA.summary}

RESEARCH & INITIATIVES:
${RESUME_DATA.focusAreas.map((f) => `• ${f.title}: ${f.details}`).join('\n')}

FEATURED PROJECTS:
• AETHOS: Gamified self-improvement engine with AI coach Ace, dynamic XP curve, cyberpunk UI.
• RootCause: Faceless technical media channel breaking down CVEs and zero-days in 60s.
• Inkwell: Distraction-free typographic note engine engineered with editorial aesthetics.

EDUCATION:
• Pune High School (Secondary Education / Class 10), Pune, India

HONORS & HIGHLIGHTS:
${RESUME_DATA.certificationsAndRankings.map((c) => `• ${c}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="resume-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="resume-modal-content"
        className="relative w-full max-w-3xl bg-[#0a0d12] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0e1219] border-b border-white/10 font-mono text-xs">
          <div className="flex items-center space-x-2 text-zinc-300">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">vedant_sattegiri_patil_cv.pdf</span>
            <span className="text-zinc-500 text-[10px]">[READ-ONLY]</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer"
              title="Copy plain text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formatted CV Document Body */}
        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto space-y-8 print:p-0 print:max-h-none print:text-black">
          {/* Header */}
          <div className="border-b border-white/10 pb-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                  Vedant Sattegiri Patil
                </h1>
                <div className="font-mono text-xs text-emerald-400 mt-1">
                  &lt;VEX&gt; • {RESUME_DATA.title}
                </div>
              </div>
              <div className="font-mono text-xs text-zinc-400 text-right space-y-0.5">
                <div>Pune, Maharashtra, India</div>
                <div className="text-zinc-300">{PERSONAL_INFO.email}</div>
                <div>
                  <a
                    href={PERSONAL_INFO.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    github.com/{PERSONAL_INFO.githubUsername}
                  </a>
                </div>
              </div>
            </div>

            <p className="mt-4 text-zinc-300 font-sans text-sm leading-relaxed font-light">
              {RESUME_DATA.summary}
            </p>
          </div>

          {/* Core Focus & Research */}
          <div className="space-y-3">
            <div className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">
              // RESEARCH & PRIMARY FOCUS
            </div>
            <div className="space-y-3">
              {RESUME_DATA.focusAreas.map((area) => (
                <div key={area.title} className="space-y-1">
                  <div className="text-sm font-semibold text-white font-serif">{area.title}</div>
                  <p className="text-zinc-400 text-xs font-sans leading-relaxed">{area.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Projects */}
          <div className="space-y-3">
            <div className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">
              // SIGNATURE SOFTWARE PROJECTS
            </div>
            <div className="space-y-4">
              {PROJECTS.map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-lg bg-zinc-900/50 border border-white/5 space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-sm font-semibold text-white">{proj.title}</span>
                    <span className="font-mono text-[11px] text-zinc-500">{proj.category}</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-zinc-400 border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <div className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">
              // EDUCATION
            </div>
            {RESUME_DATA.education.map((edu) => (
              <div key={edu.institution} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white font-medium">{edu.institution}</span>
                  <span className="text-zinc-500">{edu.period}</span>
                </div>
                <p className="text-zinc-400 text-xs font-sans">{edu.notes}</p>
              </div>
            ))}
          </div>

          {/* Technical Skills Summary */}
          <div className="space-y-3">
            <div className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">
              // TECHNICAL SKILLS & PROFICIENCIES
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs text-zinc-300">
              <div className="space-y-1">
                <span className="text-zinc-500 text-[11px] block">SECURITY & PENTESTING</span>
                <div>Burp Suite, OWASP Top 10, IDOR, SSRF, Recon tooling, Wireshark, Nmap</div>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 text-[11px] block">AI & AUTOMATION</span>
                <div>Agentic tool loops, LLM prompt engineering, Gemini API, Local models (Ollama)</div>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 text-[11px] block">PROGRAMMING LANGUAGES</span>
                <div>TypeScript, JavaScript, Python, Bash / Shell scripting, SQL</div>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 text-[11px] block">SYSTEMS & TOOLS</span>
                <div>Linux (Arch/Debian), Git, Docker, Node.js, React, Tailwind CSS</div>
              </div>
            </div>
          </div>

          {/* Cryptographic Signature Footer */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-500">
            <div>VERIFIED BY VEX RESEARCH KEY</div>
            <div>PUNE, INDIA • CLASS OF 2027</div>
          </div>
        </div>
      </div>
    </div>
  );
};
