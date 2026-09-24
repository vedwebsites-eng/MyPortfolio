import React, { useState } from 'react';
import {
  Mail,
  Github,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Key,
  Send,
  Sparkles,
  Terminal,
  Lock,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { GmailTransmissionHub } from './GmailTransmissionHub';

interface ContactProps {
  onOpenResume: () => void;
  onNotify?: (message: string, isError?: boolean) => void;
}

export const Contact: React.FC<ContactProps> = ({ onOpenResume, onNotify }) => {
  const [copiedPersonalEmail, setCopiedPersonalEmail] = useState(false);
  const [copiedPgp, setCopiedPgp] = useState(false);

  // Mode toggle: 'gmail-api' (Primary) vs 'mailto-quick'
  const [transmissionMode, setTransmissionMode] = useState<'gmail-api' | 'mailto-quick'>('gmail-api');

  // Quick Dispatch Form State (Fallback)
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [message, setMessage] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'transmitting' | 'sent'>('idle');

  const handleCopyPersonalEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.personalEmail);
    setCopiedPersonalEmail(true);
    setTimeout(() => setCopiedPersonalEmail(false), 2000);
    if (onNotify) onNotify(`Copied ${PERSONAL_INFO.personalEmail} to clipboard`);
  };

  const handleCopyPgp = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.pgpFingerprint);
    setCopiedPgp(true);
    setTimeout(() => setCopiedPgp(false), 2000);
    if (onNotify) onNotify('Copied PGP fingerprint to clipboard');
  };

  const handleTransmitFallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setDispatchStatus('transmitting');
    setTimeout(() => {
      setDispatchStatus('sent');
      const subject = encodeURIComponent(`Inquiry from ${senderName || 'Collaborator'} via Portfolio`);
      const body = encodeURIComponent(
        `From: ${senderName || 'Anonymous'} (${senderContact || 'Not specified'})\n\nMessage:\n${message}`
      );
      window.open(`mailto:${PERSONAL_INFO.personalEmail}?subject=${subject}&body=${body}`, '_blank');
    }, 600);
  };

  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-[#080b0f] relative"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Index */}
        <div className="flex items-center space-x-2 font-mono text-xs text-emerald-400 mb-3">
          <span className="text-zinc-600">//</span>
          <span>04. CONTACT</span>
        </div>

        {/* Serif Heading in Playfair Display */}
        <div className="max-w-3xl mb-12">
          <h2
            id="contact-heading"
            className="text-3xl sm:text-5xl font-serif text-white font-normal tracking-tight"
          >
            Contact
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2 font-sans font-light">
            Bug bounty research, AI systems, or Prime Nation — reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Links & Official Channels */}
          <div className="lg:col-span-5 space-y-4">
            {/* Personal Email Card */}
            <div
              id="contact-personal-email-card"
              className="p-5 rounded-xl bg-[#0d1017] border border-white/10 hover:border-emerald-500/30 transition-all space-y-3"
            >
              <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
                <span className="flex items-center space-x-2 text-zinc-300">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">EMAIL</span>
                </span>
                <span className="text-emerald-400">DIRECT</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <a
                    href={`mailto:${PERSONAL_INFO.personalEmail}`}
                    className="font-mono text-sm sm:text-base text-zinc-200 hover:text-emerald-300 transition-colors break-all"
                  >
                    {PERSONAL_INFO.personalEmail}
                  </a>
                  <div className="text-[11px] text-zinc-500 font-sans mt-0.5">
                    Primary inbox for CVE disclosures & direct communication
                  </div>
                </div>

                <div className="flex items-center space-x-2 font-mono text-xs flex-shrink-0">
                  <button
                    onClick={handleCopyPersonalEmail}
                    className="px-2.5 py-1.5 rounded bg-zinc-800 text-zinc-300 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copiedPersonalEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedPersonalEmail ? 'Copied' : 'Copy'}</span>
                  </button>

                  <a
                    href={`mailto:${PERSONAL_INFO.personalEmail}`}
                    className="px-2.5 py-1.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 flex items-center space-x-1 transition-colors"
                  >
                    <span>Write</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* GitHub Card */}
            <div
              id="contact-github-card"
              className="p-5 rounded-xl bg-[#0d1017] border border-white/10 hover:border-zinc-500/30 transition-all space-y-3"
            >
              <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
                <span className="flex items-center space-x-2 text-zinc-300">
                  <Github className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-white">CODE REPOSITORY</span>
                </span>
                <span className="text-zinc-500">OPEN-SOURCE</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <div className="font-mono text-sm sm:text-base text-zinc-200">
                    @{PERSONAL_INFO.githubUsername}
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">
                    github.com/{PERSONAL_INFO.githubUsername}
                  </div>
                </div>

                <a
                  href={PERSONAL_INFO.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 font-mono text-xs transition-colors self-start sm:self-center"
                >
                  <span>Explore GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Resume & Credentials Card */}
            <div
              id="contact-resume-card"
              className="p-5 rounded-xl bg-[#0d1017] border border-white/10 hover:border-amber-500/30 transition-all space-y-3"
            >
              <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
                <span className="flex items-center space-x-2 text-zinc-300">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-white">CURRICULUM VITAE</span>
                </span>
                <span className="text-zinc-500">UPDATED 2026</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <div className="text-zinc-200 text-sm font-sans">
                    Complete research disclosures, CTF rankings & tech stack.
                  </div>
                </div>

                <button
                  onClick={onOpenResume}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-mono text-xs transition-colors cursor-pointer self-start sm:self-center"
                >
                  <span>Inspect CV</span>
                  <FileText className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Cryptographic GPG/PGP Signature Fingerprint */}
            <div className="p-4 rounded-lg bg-[#06080b] border border-white/5 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center space-x-1.5 text-zinc-300">
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PGP FINGERPRINT</span>
                </span>
                <button
                  onClick={handleCopyPgp}
                  className="text-[11px] text-zinc-500 hover:text-emerald-400 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  {copiedPgp ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPgp ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-[11px] text-zinc-400 bg-zinc-950 p-2 rounded select-all font-mono tracking-wider break-all">
                {PERSONAL_INFO.pgpFingerprint}
              </div>
            </div>
          </div>

          {/* Right Column: Gmail Transmission Center / Mail Terminal */}
          <div className="lg:col-span-7 space-y-4">
            {/* Mode Switcher */}
            <div className="flex items-center justify-between p-1.5 rounded-xl bg-[#0d1017] border border-white/10 font-mono text-xs">
              <button
                type="button"
                onClick={() => setTransmissionMode('gmail-api')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  transmissionMode === 'gmail-api'
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-lg shadow-emerald-950/50'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Gmail API Console (Live)</span>
              </button>

              <button
                type="button"
                onClick={() => setTransmissionMode('mailto-quick')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  transmissionMode === 'mailto-quick'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Quick Mailto Dispatch</span>
              </button>
            </div>

            {transmissionMode === 'gmail-api' ? (
              <GmailTransmissionHub onNotify={onNotify} />
            ) : (
              /* Fallback Quick Dispatch Form */
              <form
                onSubmit={handleTransmitFallback}
                id="terminal-dispatch-form"
                className="rounded-2xl bg-[#0d1017] border border-white/10 p-5 sm:p-6 font-mono text-xs space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/5 text-zinc-400">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-semibold">FALLBACK DISPATCH TERMINAL</span>
                  </div>
                  <span className="text-zinc-500 text-[11px]">MAILTO CLIENT</span>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[11px] block">
                    // YOUR NAME OR PSEUDONYM
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full bg-[#080b0f] border border-white/10 rounded px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500/50"
                  >
                  </input>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[11px] block">
                    // YOUR CONTACT (EMAIL OR DISCORD)
                  </label>
                  <input
                    type="text"
                    value={senderContact}
                    onChange={(e) => setSenderContact(e.target.value)}
                    placeholder="e.g. alex@security.org"
                    className="w-full bg-[#080b0f] border border-white/10 rounded px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[11px] block">
                    // MESSAGE PAYLOAD
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Project inquiry, bug bounty discussion, or collaboration proposal..."
                    required
                    className="w-full bg-[#080b0f] border border-white/10 rounded px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500/50 resize-none font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={dispatchStatus === 'transmitting'}
                    className="w-full py-2.5 px-4 rounded bg-emerald-500 text-zinc-950 font-semibold flex items-center justify-center space-x-2 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-950/40 cursor-pointer text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {dispatchStatus === 'transmitting'
                        ? 'Compiling Transmission...'
                        : dispatchStatus === 'sent'
                        ? 'Dispatch Transmitted (Draft Ready)'
                        : 'Open Mail Client with Payload'}
                    </span>
                  </button>
                </div>

                {dispatchStatus === 'sent' && (
                  <div className="p-2.5 rounded bg-emerald-500/10 text-emerald-300 text-[11px] flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Payload prepared and mail client opened. Thank you for reaching out!</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
