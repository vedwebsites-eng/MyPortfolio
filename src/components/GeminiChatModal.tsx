import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User as UserIcon,
  RotateCcw,
  Zap,
  ShieldAlert,
  Feather,
  Copy,
  Check,
  LogIn,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import {
  auth,
  signInWithGoogle,
  signOutFirebase,
  persistChatMessage,
  loadChatHistory,
} from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

interface GeminiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiChatModal: React.FC<GeminiChatModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I am VEX AI, powered by Gemini. Ask me anything about Vedant's projects (AETHOS, Inkwell, RootCount), cybersecurity research, exploit breakdowns, or tech stack.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [selectedRole, setSelectedRole] = useState<string>('vex_assistant');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId] = useState<string>(() => 'session_' + Date.now().toString(36));

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Track Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Attempt loading recent chat history from Firestore
        const history = await loadChatHistory(user.uid, sessionId);
        if (history.length > 0) {
          setMessages(
            history.map((m, idx) => ({
              id: `history_${idx}`,
              role: m.role,
              text: m.text,
              timestamp: '',
              modelUsed: selectedModel,
            }))
          );
        }
      }
    });
    return () => unsub();
  }, [sessionId, selectedModel]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: 'user_' + Date.now(),
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    // Persist user message to Firestore if logged in
    if (currentUser) {
      persistChatMessage(currentUser.uid, sessionId, 'user', textToSend.trim());
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, text: m.text })),
          model: selectedModel,
          role: selectedRole,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to communicate with Gemini API');
      }

      const modelMessage: Message = {
        id: 'model_' + Date.now(),
        role: 'model',
        text: data.text || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model || selectedModel,
      };

      setMessages((prev) => [...prev, modelMessage]);

      // Persist model response to Firestore if logged in
      if (currentUser) {
        persistChatMessage(currentUser.uid, sessionId, 'model', modelMessage.text);
      }
    } catch (err: any) {
      const errorMessage: Message = {
        id: 'err_' + Date.now(),
        role: 'model',
        text: `⚠️ Error: ${err.message || 'Unable to connect to Gemini API. Please check your network or server.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetConversation = () => {
    setMessages([
      {
        id: 'welcome_reset',
        role: 'model',
        text: "Conversation thread cleared. What would you like to investigate or discuss next?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: 'AETHOS AI Coach', text: 'Explain the mechanics of AETHOS and how its AI Coach "Ace" works.' },
    { label: 'RootCount CVEs', text: 'What is the RootCount channel about and what CVEs are deconstructed?' },
    { label: 'Inkwell Typography', text: 'Why did Vedant design Inkwell with a 65ch line measure and local-first architecture?' },
    { label: 'Cybersecurity Skills', text: 'What are Vedant\'s core competencies in cybersecurity and vulnerability research?' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#090b10] border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col h-[85vh] max-h-[750px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-black/60 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-mono font-semibold text-sm">
                  VEX // GEMINI MULTI-TURN AI
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  {selectedModel}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                Real-time multi-turn intelligence powered by Google Gemini SDK
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetConversation}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls Toolbar: Roles, Models, and Auth Persistence */}
        <div className="p-3 bg-[#0d1017] border-b border-white/5 space-y-2.5 text-xs font-mono">
          {/* Roles */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-zinc-500 text-[11px]">ROLE:</span>
              <button
                onClick={() => setSelectedRole('vex_assistant')}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  selectedRole === 'vex_assistant'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                VEX Assistant
              </button>
              <button
                onClick={() => setSelectedRole('exploit_analyst')}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  selectedRole === 'exploit_analyst'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Exploit Analyst
              </button>
              <button
                onClick={() => setSelectedRole('product_architect')}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  selectedRole === 'product_architect'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                UX Architect
              </button>
            </div>

            {/* Model Selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-zinc-500 text-[11px]">MODEL:</span>
              <button
                onClick={() => setSelectedModel('gemini-3.5-flash')}
                className={`px-2 py-1 rounded text-[10px] ${
                  selectedModel === 'gemini-3.5-flash'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'bg-zinc-900 text-zinc-400'
                }`}
                title="General tasks (default)"
              >
                3.5-flash
              </button>
              <button
                onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                className={`px-2 py-1 rounded text-[10px] ${
                  selectedModel === 'gemini-3.1-flash-lite'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'bg-zinc-900 text-zinc-400'
                }`}
                title="Fast tasks"
              >
                3.1-lite
              </button>
              <button
                onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
                className={`px-2 py-1 rounded text-[10px] ${
                  selectedModel === 'gemini-3.1-pro-preview'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'bg-zinc-900 text-zinc-400'
                }`}
                title="Complex reasoning"
              >
                3.1-pro
              </button>
            </div>
          </div>

          {/* User Auth & Firestore Persistence Status */}
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5 text-zinc-400">
            <div className="flex items-center space-x-2">
              {currentUser ? (
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Firestore Sync: {currentUser.email}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-zinc-500">
                  <span>Local session (sign in to persist in Firestore)</span>
                </div>
              )}
            </div>

            <div>
              {currentUser ? (
                <button
                  onClick={signOutFirebase}
                  className="text-zinc-500 hover:text-zinc-300 flex items-center space-x-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign out</span>
                </button>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold cursor-pointer"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Google Sign-In</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Message Thread (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center space-x-1.5 text-[10px] font-mono text-zinc-500 mb-1">
                {m.role === 'user' ? (
                  <>
                    <span>YOU</span>
                    <span>•</span>
                    <span>{m.timestamp}</span>
                  </>
                ) : (
                  <>
                    <span className="text-cyan-400 font-semibold">VEX AI</span>
                    {m.modelUsed && (
                      <span className="text-[9px] px-1 rounded bg-zinc-800 text-zinc-400">
                        {m.modelUsed}
                      </span>
                    )}
                    <span>•</span>
                    <span>{m.timestamp}</span>
                  </>
                )}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-cyan-600/20 text-cyan-100 border border-cyan-500/30 font-sans'
                    : 'bg-[#111520] text-zinc-200 border border-white/5 font-sans relative group'
                }`}
              >
                {m.text}

                {m.role === 'model' && (
                  <button
                    onClick={() => handleCopy(m.id, m.text)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white"
                    title="Copy message"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start space-y-1">
              <div className="text-[10px] font-mono text-cyan-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Generating response via Gemini...</span>
              </div>
              <div className="bg-[#111520] border border-white/5 rounded-2xl p-3.5 text-xs text-zinc-400 animate-pulse font-mono">
                [Token streaming & reasoning active...]
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Chips */}
        <div className="px-4 py-2 bg-[#090b10] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          <span className="text-zinc-600 flex-shrink-0">PROMPTS:</span>
          {quickPrompts.map((qp) => (
            <button
              key={qp.label}
              onClick={() => handleSend(qp.text)}
              disabled={isLoading}
              className="flex-shrink-0 px-2.5 py-1 rounded bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer text-[10px]"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#0d1017] border-t border-white/10 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={`Ask VEX AI with ${selectedModel} (e.g. "Explain the XZ Utils exploit")...`}
            className="flex-1 bg-[#06080d] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60 font-sans"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              input.trim() && !isLoading
                ? 'bg-cyan-500 text-black hover:bg-cyan-400 cursor-pointer shadow-lg shadow-cyan-500/20'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
