import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Send,
  FileEdit,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  Inbox,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  setAccessTokenInMemory,
} from '../services/gmailAuth';
import {
  getGmailProfile,
  sendGmailMessage,
  createGmailDraft,
  listGmailMessages,
  GmailProfile,
  GmailMessageSummary,
  SendEmailParams,
} from '../services/gmailApi';
import { GoogleSignInButton } from './GoogleSignInButton';
import { GmailConfirmModal } from './GmailConfirmModal';
import { PERSONAL_INFO } from '../data/portfolioData';

interface GmailTransmissionHubProps {
  onNotify?: (message: string, isError?: boolean) => void;
}

export const GmailTransmissionHub: React.FC<GmailTransmissionHubProps> = ({ onNotify }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<GmailProfile | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'compose' | 'inbox'>('compose');

  // Form state
  const [destinationEmail, setDestinationEmail] = useState<string>(PERSONAL_INFO.personalEmail);
  const [subject, setSubject] = useState('');
  const [cc, setCc] = useState('');
  const [body, setBody] = useState('');
  const [templateSelected, setTemplateSelected] = useState<string>('');

  // Confirmation modal state (MANDATORY per Workspace Skill)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmMode, setConfirmMode] = useState<'send' | 'draft'>('send');
  const [isExecutingApi, setIsExecutingApi] = useState(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState<{
    id: string;
    mode: 'send' | 'draft';
    timestamp: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inbox state
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        loadProfile(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
        setProfile(null);
      }
    );

    return () => unsubscribe();
  }, []);

  const loadProfile = async (token: string) => {
    try {
      const prof = await getGmailProfile(token);
      setProfile(prof);
    } catch (err: unknown) {
      console.warn('Could not fetch Gmail profile:', err);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);
        await loadProfile(result.accessToken);
        if (onNotify) onNotify(`Authenticated as ${result.user.email}`);
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setErrorMessage(err.message || 'Google sign-in was aborted or encountered an error.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setAccessToken(null);
      setProfile(null);
      setMessages([]);
      setTransmissionSuccess(null);
      if (onNotify) onNotify('Signed out of Gmail');
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  const fetchInbox = useCallback(async () => {
    const token = accessToken || (await getAccessToken());
    if (!token) return;

    setIsLoadingMessages(true);
    try {
      const items = await listGmailMessages(token, '', 6);
      setMessages(items);
    } catch (err: any) {
      console.error('Inbox fetch error:', err);
      setErrorMessage(err.message || 'Unable to fetch recent messages.');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (activeTab === 'inbox' && (currentUser || accessToken)) {
      fetchInbox();
    }
  }, [activeTab, currentUser, accessToken, fetchInbox]);

  const applyTemplate = (type: string) => {
    setTemplateSelected(type);
    if (type === 'security') {
      setDestinationEmail(PERSONAL_INFO.personalEmail);
      setSubject('[Security Report] Vulnerability Disclosure / Finding');
      setBody(
        `Hi Vedant,\n\nI have observed a potential security finding regarding one of your repositories/projects.\n\nSeverity: Low / Medium / High\nTarget Asset:\nDescription of Behavior:\nSteps to Reproduce:\n\nLooking forward to your analysis.`
      );
    } else if (type === 'ai_collab') {
      setDestinationEmail(PERSONAL_INFO.personalEmail);
      setSubject('Collaboration Proposal: Autonomous AI & Agentic Tooling');
      setBody(
        `Hi Vedant,\n\nI came across your projects (AETHOS / RootCause) and would love to discuss a collaboration on agentic AI workflows and LLM tool-calling architectures.\n\nProposed Concept:\nTech Stack / Synergy:\n\nBest regards,`
      );
    } else if (type === 'work') {
      setDestinationEmail(PERSONAL_INFO.workEmail);
      setSubject('Project / Work Inquiry: Prime Nation & Engineering');
      setBody(
        `Hi Vedant,\n\nReaching out regarding your engineering work and Prime Nation initiatives.\n\nOrganization / Background:\nScope of Work:\nTimeline & Milestones:\n\nLooking forward to speaking.`
      );
    } else {
      setSubject('');
      setBody('');
    }
  };

  // Pre-validate before opening confirmation dialog
  const handleInitiateTransmission = (mode: 'send' | 'draft') => {
    setErrorMessage(null);
    if (!destinationEmail || !destinationEmail.includes('@')) {
      setErrorMessage('Please specify a valid recipient email address.');
      return;
    }
    if (!subject.trim()) {
      setErrorMessage('Please provide an email subject.');
      return;
    }
    if (!body.trim()) {
      setErrorMessage('Please include a message body.');
      return;
    }

    setConfirmMode(mode);
    setConfirmModalOpen(true);
  };

  // Execute after user confirmation in the dialog
  const handleConfirmedExecution = async () => {
    const token = accessToken || (await getAccessToken());
    if (!token) {
      setErrorMessage('Authentication session expired. Please sign in with Google again.');
      setConfirmModalOpen(false);
      return;
    }

    setIsExecutingApi(true);
    setErrorMessage(null);

    const payload: SendEmailParams = {
      to: destinationEmail,
      subject: subject.trim(),
      body: body.trim(),
      cc: cc.trim() || undefined,
      fromName: currentUser?.displayName || undefined,
    };

    try {
      if (confirmMode === 'send') {
        const result = await sendGmailMessage(token, payload);
        setTransmissionSuccess({
          id: result.id,
          mode: 'send',
          timestamp: new Date().toLocaleTimeString(),
        });
        if (onNotify) onNotify(`Email transmitted via Gmail API (ID: ${result.id.slice(0, 8)})`);
      } else {
        const result = await createGmailDraft(token, payload);
        setTransmissionSuccess({
          id: result.id,
          mode: 'draft',
          timestamp: new Date().toLocaleTimeString(),
        });
        if (onNotify) onNotify(`Draft created in Gmail (ID: ${result.id.slice(0, 8)})`);
      }

      setConfirmModalOpen(false);
      // Reset body & subject on success
      setSubject('');
      setBody('');
      setCc('');
    } catch (err: any) {
      console.error('Gmail API Execution failed:', err);
      setErrorMessage(err.message || 'Operation failed. Please try again.');
    } finally {
      setIsExecutingApi(false);
    }
  };

  return (
    <div
      id="gmail-transmission-hub"
      className="rounded-2xl bg-[#0c1017] border border-emerald-500/20 shadow-2xl overflow-hidden font-mono text-xs"
    >
      {/* Top Banner: Google Identity & Connection State */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/40 via-cyan-950/20 to-black/40 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#131720] text-emerald-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-semibold text-sm">GMAIL INTEGRATION CONSOLE</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300">
                1P Workspace API
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
              Direct authenticated email transmission & draft synchronization with Vedant
            </p>
          </div>
        </div>

        {/* Auth status indicator */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {currentUser ? (
            <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] max-w-[180px] truncate">{currentUser.email}</span>
              <button
                onClick={handleSignOut}
                className="ml-1.5 text-zinc-400 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                title="Sign out of Gmail"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-zinc-400 bg-zinc-900/80 px-2.5 py-1.5 rounded text-[11px]">
              <span className="w-2 h-2 rounded-full bg-zinc-600" />
              <span>Not Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Panel Content */}
      {!currentUser ? (
        /* Sign-in prompt state */
        <div className="p-6 sm:p-8 text-center space-y-5 bg-[#090c10]">
          <div className="max-w-md mx-auto space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif text-white font-medium">
              Authenticate via Google Workspace
            </h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Sign in with your Google account to transmit encrypted project dispatches, deliver bug
              bounty findings directly into Vedant's inbox, or synchronize drafts.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center pt-2 space-y-3">
            <GoogleSignInButton
              onClick={handleSignIn}
              disabled={isSigningIn}
              label={isSigningIn ? 'Connecting to Google...' : 'Sign in with Google'}
            />
            <div className="text-[10px] text-zinc-500 flex items-center space-x-1.5 font-sans">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Tokens cached strictly in-memory per security guidelines.</span>
            </div>
          </div>

          {errorMessage && (
            <div className="max-w-md mx-auto p-3 rounded-lg bg-red-500/10 text-red-300 text-[11px] flex items-start space-x-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick info badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto pt-4 text-left border-t border-white/5 text-zinc-400">
            <div className="p-3 rounded-lg bg-[#0d1117] space-y-1">
              <span className="text-emerald-400 font-semibold block text-[11px]">
                PERSONAL INBOX
              </span>
              <span className="text-white text-xs">{PERSONAL_INFO.personalEmail}</span>
              <p className="text-[10px] text-zinc-500 font-sans">
                For vulnerability research, security questions & direct tech chat.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#0d1117] space-y-1">
              <span className="text-cyan-400 font-semibold block text-[11px]">
                WORK & COLLAB INBOX
              </span>
              <span className="text-white text-xs">{PERSONAL_INFO.workEmail}</span>
              <p className="text-[10px] text-zinc-500 font-sans">
                For engineering contracts, corporate inquiries & Prime Nation.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated state */
        <div className="p-5 sm:p-6 space-y-5 bg-[#090c10]">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setActiveTab('compose')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer text-xs ${
                  activeTab === 'compose'
                    ? 'bg-emerald-500 text-zinc-950 font-semibold'
                    : 'text-zinc-400 hover:text-white bg-zinc-900/60'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Email</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('inbox')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer text-xs ${
                  activeTab === 'inbox'
                    ? 'bg-emerald-500 text-zinc-950 font-semibold'
                    : 'text-zinc-400 hover:text-white bg-zinc-900/60'
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Inbox Activity</span>
                {profile && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
                    {profile.messagesTotal} msgs
                  </span>
                )}
              </button>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-[11px] text-zinc-400">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentUser.displayName || currentUser.email}</span>
            </div>
          </div>

          {/* Success Banner */}
          {transmissionSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-300 flex items-start justify-between gap-3 animate-in fade-in">
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-xs text-white">
                    {transmissionSuccess.mode === 'send'
                      ? 'Transmission Successfully Dispatched'
                      : 'Draft Created in Your Gmail Mailbox'}
                  </div>
                  <div className="text-[11px] text-zinc-300 font-mono mt-0.5">
                    Message ID:{' '}
                    <span className="text-emerald-400 font-bold">{transmissionSuccess.id}</span> •{' '}
                    {transmissionSuccess.timestamp}
                  </div>
                </div>
              </div>
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] flex items-center space-x-1"
              >
                <span>View in Gmail</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-300 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === 'compose' ? (
            /* Compose / Transmission View */
            <div className="space-y-4">
              {/* Template quick selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-zinc-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>// QUICK PAYLOAD TEMPLATES</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyTemplate('security')}
                    className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                      templateSelected === 'security'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Security / Bug Bounty
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('ai_collab')}
                    className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                      templateSelected === 'ai_collab'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    AI Systems Collab
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('work')}
                    className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                      templateSelected === 'work'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Work & Prime Nation
                  </button>
                </div>
              </div>

              {/* Destination selector */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 text-[11px] block">// TARGET DESTINATION</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDestinationEmail(PERSONAL_INFO.personalEmail)}
                    className={`p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                      destinationEmail === PERSONAL_INFO.personalEmail
                        ? 'bg-emerald-500/10 text-white'
                        : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-emerald-400">Personal & Security</span>
                      <span className="text-[10px] text-zinc-500">DIRECT</span>
                    </div>
                    <div className="text-xs text-zinc-300 font-mono mt-0.5">
                      {PERSONAL_INFO.personalEmail}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDestinationEmail(PERSONAL_INFO.workEmail)}
                    className={`p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                      destinationEmail === PERSONAL_INFO.workEmail
                        ? 'bg-cyan-500/10 text-white'
                        : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-cyan-400">Work & Enterprise</span>
                      <span className="text-[10px] text-zinc-500">OFFICIAL</span>
                    </div>
                    <div className="text-xs text-zinc-300 font-mono mt-0.5">
                      {PERSONAL_INFO.workEmail}
                    </div>
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-zinc-400 text-[11px] block">// EMAIL SUBJECT</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Vulnerability Disclosure: CVE-xxxx or AI Tooling Question"
                  className="w-full bg-[#0d1017] rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>

              {/* CC (Optional) */}
              <div className="space-y-1">
                <label className="text-zinc-400 text-[11px] block">// CC (OPTIONAL)</label>
                <input
                  type="email"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="Optional additional recipient"
                  className="w-full bg-[#0d1017] rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>

              {/* Body */}
              <div className="space-y-1">
                <label className="text-zinc-400 text-[11px] block">// TRANSMISSION PAYLOAD</label>
                <textarea
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your email payload here..."
                  className="w-full bg-[#0d1017] rounded-lg px-3 py-2.5 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none font-mono"
                />
              </div>

              {/* Dispatch Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleInitiateTransmission('send')}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-lg bg-emerald-500 text-zinc-950 font-semibold flex items-center justify-center space-x-2 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-950/40 cursor-pointer text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit via Gmail API</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInitiateTransmission('draft')}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700 flex items-center justify-center space-x-2 transition-colors cursor-pointer text-xs"
                >
                  <FileEdit className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save as Draft</span>
                </button>
              </div>

              <div className="text-[10px] text-zinc-500 flex items-center space-x-1.5 pt-1">
                <ShieldCheck className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span>
                  Mandatory confirmation dialog will verify recipient, subject, and payload before
                  transmission.
                </span>
              </div>
            </div>
          ) : (
            /* Inbox / Activity View */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-zinc-400 text-xs">
                <span>Recent messages in your authenticated mailbox:</span>
                <button
                  onClick={fetchInbox}
                  disabled={isLoadingMessages}
                  className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {isLoadingMessages ? (
                <div className="p-8 text-center text-zinc-500 space-y-2">
                  <RefreshCw className="w-5 h-5 mx-auto animate-spin text-emerald-400" />
                  <p>Querying Gmail API...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 bg-[#0d1017] rounded-xl">
                  <Inbox className="w-6 h-6 mx-auto text-zinc-600 mb-2" />
                  <p className="text-zinc-400">No recent messages retrieved or mailbox is empty.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3 rounded-lg bg-[#0d1017] hover:bg-zinc-900 transition-all space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-semibold truncate max-w-[200px]">
                          {msg.from}
                        </span>
                        <span className="text-zinc-500 text-[10px]">{msg.date}</span>
                      </div>
                      <div className="text-xs text-white font-medium truncate">{msg.subject}</div>
                      <div className="text-[11px] text-zinc-400 font-sans truncate">
                        {msg.snippet}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal (MANDATORY User Confirmation) */}
      <GmailConfirmModal
        isOpen={confirmModalOpen}
        mode={confirmMode}
        params={{
          to: destinationEmail,
          subject: subject.trim(),
          body: body.trim(),
          cc: cc.trim() || undefined,
        }}
        isProcessing={isExecutingApi}
        onConfirm={handleConfirmedExecution}
        onCancel={() => setConfirmModalOpen(false)}
      />
    </div>
  );
};
