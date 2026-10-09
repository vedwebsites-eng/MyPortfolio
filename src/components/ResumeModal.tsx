import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Copy, Check, FileText, ArrowUp } from 'lucide-react';
import { RESUME_DATA, PROJECTS, PERSONAL_INFO } from '../data/portfolioData';
import { downloadResumePdf } from '../utils/pdfGenerator';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    try {
      const ok = await downloadResumePdf('vedant_sattegiri_patil_cv.pdf');
      if (ok) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleScrollToTop = () => {
    const overlay = document.getElementById('resume-modal-overlay');
    if (overlay) {
      overlay.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const content = document.getElementById('resume-modal-content');
    const scrollableBody = content?.querySelector('.overflow-y-auto');
    if (scrollableBody) {
      scrollableBody.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopy = () => {
    const plainText = `
Vedant Sattegiri Patil
Student-Builder & Security Researcher
Location: Pune, Maharashtra, India
Email: veddoesai@proton.me
GitHub: https://github.com/vedwebsites-eng

SUMMARY:
15-year-old self-taught builder and security researcher based in Pune. Blending an offensive cybersecurity mindset with modern AI system development and software engineering. Passionate about uncovering edge-case vulnerabilities, creating developer tooling, and educating builders through high-signal technical content.

RESEARCH & INITIATIVES:
• Bug Bounty Research & Vulnerability Hunting: Active research on web applications, finding logic bugs, access control failures (IDORs), and misconfigurations. Focus on automated recon tooling.
• Autonomous AI Tooling & Local Intelligence: Building agentic workflows that turn unstructured instructions into deterministic multi-step tool execution. Integrating Gemini & local LLMs.
• Technical Media & Content (RootCause): Creator and producer of RootCause, producing short-form video content covering technology and cybersecurity concepts.

FEATURED PROJECTS:
• AETHOS: Gamified self-improvement engine with AI coach Ace, dynamic XP curve, cyberpunk UI.
• RootCause: Faceless YouTube channel covering tech and cybersecurity in short-form video.
• Inkwell: Distraction-free typographic note engine engineered with editorial aesthetics.

EDUCATION:
• Pune High School (Secondary Education / Class 10), Pune, India

HONORS & HIGHLIGHTS:
• 3x Bug Bounty Programs, HackerOne — valid vulnerability disclosed
• 3x AI Workshops completed under Vaibhav Sisinty (Outskill)
• Anthropic Certified — Claude, Claude Code, Claude Cowork
• CCNA (Networking) — in progress
    `.trim();

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="resume-modal-overlay"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="resume-modal-content"
        className="relative w-full max-w-3xl bg-[#0a0d12] border border-white/15 rounded-2xl shadow-2xl flex flex-col my-auto max-h-[calc(100vh-2rem)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#0e1219] border-b border-white/10 font-mono text-xs">
          <div className="flex items-center space-x-2 text-zinc-300 min-w-0">
            <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-semibold text-white truncate">vedant_sattegiri_patil_cv.pdf</span>
            <span className="text-zinc-500 text-[10px] hidden sm:inline">[READ-ONLY]</span>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer"
              title="Copy plain text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs transition-colors cursor-pointer font-medium disabled:opacity-50"
              title="Download CV as PDF to local computer"
            >
              {isDownloading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span>Saving PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download as PDF</span>
                </>
              )}
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
        <div className="flex-1 min-h-0 p-5 sm:p-8 lg:p-10 overflow-y-auto space-y-8 print:p-0 print:max-h-none print:text-black">
          {/* Header */}
          <div className="border-b border-white/10 pb-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-sans font-bold text-white">
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
                    className="text-emerald-400 hover:underline"
                  >
                    github.com/{PERSONAL_INFO.githubUsername}
                  </a>
                </div>
              </div>
            </div>

            <p className="mt-4 text-zinc-300 font-sans text-sm sm:text-base leading-relaxed">
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
                  <div className="text-sm font-semibold text-white font-sans">{area.title}</div>
                  <p className="text-zinc-300 text-sm font-sans leading-relaxed">{area.details}</p>
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
                    <span className="font-sans text-sm font-semibold text-white">{proj.title}</span>
                    <span className="font-mono text-[11px] text-zinc-500">{proj.category}</span>
                  </div>
                  <p className="text-sm text-zinc-300 font-sans leading-relaxed">{proj.description}</p>
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
            <div className="space-y-1.5 font-mono text-xs text-zinc-300">
              <div className="flex items-start space-x-2">
                <span className="text-emerald-400 select-none">▸</span>
                <span>Pune High School (Secondary Education / Class 10), Pune, India</span>
              </div>
            </div>
          </div>

          {/* Honors & Highlights */}
          <div className="space-y-3">
            <div className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">
              // HONORS & HIGHLIGHTS
            </div>
            <div className="space-y-1.5 font-mono text-xs text-zinc-300">
              {RESUME_DATA.certificationsAndRankings.map((cert) => (
                <div key={cert} className="flex items-start space-x-2">
                  <span className="text-emerald-400 select-none">▸</span>
                  <span>{cert}</span>
                </div>
              ))}
            </div>
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

          {/* Modal Footer */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-zinc-500">
            <div>
              {RESUME_DATA.name} • {RESUME_DATA.location}
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
                title="Download CV as PDF to local computer"
              >
                {isDownloading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <span>Saving PDF...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved to Computer</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleScrollToTop}
                className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Scroll to top"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
