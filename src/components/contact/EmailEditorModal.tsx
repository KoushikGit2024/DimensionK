"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Send, CheckCircle2, AlertTriangle, ShieldCheck, Terminal } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";

interface EmailEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export const EmailEditorModal: React.FC<EmailEditorModalProps> = ({
  isOpen,
  onClose,
  defaultSubject = "Software Engineering Opportunity — Koushik Kar",
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setSubject(defaultSubject);
  }, [defaultSubject]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      setStatus("idle");
      setErrorMessage("");
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName,
          senderEmail,
          subject,
          message,
          transmissionVector: honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to deliver transmission.");
      }

      setStatus("success");
      setMessage("");
      setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 3000);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Network error occurred.");
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="backdrop:bg-void/85 backdrop:backdrop-blur-md bg-transparent p-0 m-auto max-w-2xl w-[92vw] outline-none shadow-2xl z-50"
    >
      <div className="rounded-xl border border-white/[0.12] bg-surface-raised text-text overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.85)] flex flex-col">
        {/* Editor Window Header */}
        <div className="px-5 py-3.5 bg-surface border-b border-white/[0.08] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span className="text-text font-semibold uppercase tracking-wider">
              ENCRYPTED TRANSMISSION EDITOR
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-text-dim hover:text-text hover:bg-white/[0.04] transition-colors cursor-pointer"
            aria-label="Close editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        {status === "success" ? (
          <div className="p-10 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-warm mx-auto animate-bounce" />
            <h3 className="font-display text-3xl text-text font-normal">
              Transmission Delivered
            </h3>
            <p className="font-sans text-sm text-text-secondary max-w-md mx-auto">
              Your message has been verified and securely routed to Koushik&apos;s personal inbox. You will receive an acknowledgment return signal shortly.
            </p>
            <div className="font-mono text-xs text-text-dim pt-4">
              WINDOW CLOSING AUTOMATICALLY...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Honeypot field (hidden from screen, catches bots) */}
            <input
              type="text"
              name="transmissionVector"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="sr-only"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] uppercase tracking-wider text-text-dim">
                  Your Name / Identity
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3.5 py-2.5 rounded-md bg-void border border-white/[0.08] focus:border-accent text-sm text-text outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] uppercase tracking-wider text-text-dim">
                  Return Transmission Email
                </label>
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-md bg-void border border-white/[0.08] focus:border-accent text-sm text-text outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-text-dim">
                Transmission Subject / Protocol
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-void border border-white/[0.08] focus:border-accent text-sm text-text outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-text-dim">
                Message Content & Invariants
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share role specifics, engineering requirements, or tooling collaboration ideas..."
                className="w-full px-3.5 py-2.5 rounded-md bg-void border border-white/[0.08] focus:border-accent text-sm text-text outline-none resize-none transition-colors"
              />
            </div>

            {status === "error" && (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-200 font-mono">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="pt-3 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-dim">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>Protected with Server Rate Limiting & Bot Scrubbing</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-mono text-text-muted hover:text-text transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={buttonStyles("primary", "md")}
                >
                  <Send className="w-3.5 h-3.5 text-accent" />
                  <span>{status === "sending" ? "Dispatching..." : "Transmit Signal"}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
};

