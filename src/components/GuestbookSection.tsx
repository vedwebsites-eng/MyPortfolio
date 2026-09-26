import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  LogIn,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Sparkles,
  Flame,
} from 'lucide-react';
import {
  auth,
  signInWithGoogle,
  signOutFirebase,
  addGuestbookNote,
  subscribeToGuestbook,
  GuestbookEntry,
} from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export const GuestbookSection: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    const unsubFirestore = subscribeToGuestbook((loadedEntries) => {
      setEntries(loadedEntries);
    });

    return () => {
      unsubAuth();
      unsubFirestore();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMsg('Please sign in with Google to leave a persistent note.');
      return;
    }
    if (!newMessage.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await addGuestbookNote(currentUser, newMessage.trim());
      setNewMessage('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit endorsement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-[#07090d]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center space-x-2 font-mono text-xs text-cyan-400 mb-3">
          <span className="text-zinc-600">//</span>
          <span>03. GUESTBOOK</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-normal tracking-tight">
              Guestbook
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 font-sans font-light max-w-xl">
              Leave a note. Signed in with Google, stored live.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-2.5 bg-zinc-900/90 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    width={20}
                    height={20}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-zinc-200 truncate max-w-[120px]">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={signOutFirebase}
                  className="text-zinc-500 hover:text-zinc-300 ml-1 cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Google Sign-In</span>
              </button>
            )}
          </div>
        </div>

        {/* Input Card */}
        <div className="rounded-2xl bg-[#0b0e14] border border-white/10 p-5 sm:p-6 mb-8 shadow-xl">
          {currentUser ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Signed in as {currentUser.displayName || currentUser.email} — authenticated with Firebase</span>
              </div>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={3}
                placeholder="Leave an endorsement, project idea, or security question..."
                className="w-full bg-[#06080c] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60 font-sans"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-zinc-500">
                  STORED SECURELY IN FIRESTORE
                </span>
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSubmitting}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold flex items-center space-x-2 transition-all ${
                    newMessage.trim() && !isSubmitting
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400 cursor-pointer shadow-lg shadow-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'PERSISTING...' : 'POST NOTE'}</span>
                </button>
              </div>
              {errorMsg && (
                <p className="text-rose-400 text-xs font-mono pt-1">{errorMsg}</p>
              )}
            </form>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-white text-sm font-serif">Sign in to leave a persistent note</div>
                <p className="text-xs text-zinc-400 font-sans">
                  Sign in securely using your Google account to record your visitor endorsement in Firestore.
                </p>
              </div>
              <button
                onClick={signInWithGoogle}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                <span>Sign in with Google</span>
              </button>
            </div>
          )}
        </div>

        {/* Entries List */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-zinc-500 flex items-center justify-between">
            <span>RECENT FIRESTORE REGISTRY</span>
            <span>{entries.length} POSTED</span>
          </div>

          {entries.length === 0 ? (
            <div className="rounded-xl bg-[#090c12] border border-white/5 p-6 text-center text-xs font-mono text-zinc-500">
              No entries recorded in Firestore yet. Be the first to leave a verified note!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {entries.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-[#0a0d14] border border-white/5 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {item.authorPhoto ? (
                        <img
                          src={item.authorPhoto}
                          alt={item.authorName}
                          width={20}
                          height={20}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono">
                          {item.authorName.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-medium text-white font-serif">
                        {item.authorName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {new Date(item.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
