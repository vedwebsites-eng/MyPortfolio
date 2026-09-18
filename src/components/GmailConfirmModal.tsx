import React from 'react';
import { ShieldAlert, Send, X, AlertTriangle, Mail } from 'lucide-react';
import { SendEmailParams } from '../services/gmailApi';

interface GmailConfirmModalProps {
  isOpen: boolean;
  params: SendEmailParams | null;
  mode: 'send' | 'draft';
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const GmailConfirmModal: React.FC<GmailConfirmModalProps> = ({
  isOpen,
  params,
  mode,
  isProcessing,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !params) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        id="gmail-confirmation-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gmail-confirm-title"
        className="w-full max-w-lg rounded-2xl bg-[#0c1017] border border-amber-500/30 shadow-2xl shadow-amber-950/30 overflow-hidden font-sans"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-transparent border-b border-white/10 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="gmail-confirm-title"
                className="text-base font-semibold text-white tracking-tight"
              >
                {mode === 'send' ? 'Confirm Email Transmission' : 'Confirm Draft Creation'}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Workspace API Action Verification Required
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cancel and close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Payload Review */}
        <div className="p-5 space-y-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-black/50 border border-white/5 space-y-2">
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <span className="text-zinc-500">ACTION:</span>
              <span className="text-amber-300 font-semibold uppercase">
                {mode === 'send' ? 'GMAIL.MESSAGES.SEND' : 'GMAIL.DRAFTS.CREATE'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <span className="text-zinc-500">RECIPIENT (TO):</span>
              <span className="text-emerald-400 font-semibold">{params.to}</span>
            </div>
            {params.cc && (
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <span className="text-zinc-500">COPIED (CC):</span>
                <span className="text-zinc-300">{params.cc}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <span className="text-zinc-500">SUBJECT:</span>
              <span className="text-white font-medium truncate max-w-[280px]">
                {params.subject || '(No subject)'}
              </span>
            </div>
            <div className="pt-1">
              <span className="text-zinc-500 block mb-1">MESSAGE BODY PREVIEW:</span>
              <div className="p-2.5 rounded bg-zinc-950/80 text-zinc-300 max-h-32 overflow-y-auto whitespace-pre-wrap font-sans text-xs border border-white/5">
                {params.body}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-[11px] text-zinc-400 font-sans bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              This operation will execute via your authenticated Gmail account and transmit an official
              email message. Please review the details above before confirming.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-950/60 border-t border-white/10 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 text-xs font-mono transition-colors cursor-pointer"
          >
            Abort / Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-semibold text-xs font-mono flex items-center space-x-2 transition-colors cursor-pointer shadow-lg shadow-emerald-950/50"
          >
            {isProcessing ? (
              <span className="inline-block animate-pulse">Transmitting to Gmail...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>
                  {mode === 'send' ? 'Confirm & Send Email' : 'Confirm & Save Draft'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
