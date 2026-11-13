"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, CornerDownLeft } from "lucide-react";

export interface CommandItem {
  id: string;
  label: string;
  category: "Navigation" | "Projects" | "Action";
  hint?: string;
  run: () => void;
}

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: "nav-work",
        label: "Projects & Systems",
        category: "Navigation",
        hint: "#work",
        run: () => router.push("/#work"),
      },
      {
        id: "nav-capabilities",
        label: "Capabilities Matrix",
        category: "Navigation",
        hint: "#capabilities",
        run: () => router.push("/#capabilities"),
      },
      {
        id: "nav-methodology",
        label: "Systems Methodology",
        category: "Navigation",
        hint: "#methodology",
        run: () => router.push("/#methodology"),
      },
      {
        id: "nav-logbook",
        label: "Education & Logbook",
        category: "Navigation",
        hint: "#logbook",
        run: () => router.push("/#logbook"),
      },
      {
        id: "nav-contact",
        label: "Establish Transmission",
        category: "Navigation",
        hint: "#contact",
        run: () => router.push("/#contact"),
      },
      {
        id: "proj-codelens",
        label: "CodeLens Architecture Study",
        category: "Projects",
        hint: "AST & Topology",
        run: () => router.push("/projects/codelens"),
      },
      {
        id: "proj-ludo-neo",
        label: "Ludo Neo Game Engine Study",
        category: "Projects",
        hint: "Socket.IO & Redis",
        run: () => router.push("/projects/ludo-neo"),
      },
      {
        id: "proj-algovisuals",
        label: "AlgoVisuals Execution Study",
        category: "Projects",
        hint: "Step Snapshots",
        run: () => router.push("/projects/algovisuals"),
      },
      {
        id: "action-github",
        label: "Open GitHub Profile",
        category: "Action",
        hint: "external",
        run: () => window.open("https://github.com/koushikkar712", "_blank"),
      },
    ],
    [router]
  );

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.hint?.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Handle Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync dialog visibility
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  // Reset selected item on filter change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const runCommand = (cmd: CommandItem) => {
    setOpen(false);
    cmd.run();
  };

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        runCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={() => setOpen(false)}
      className="backdrop:bg-void/80 backdrop:backdrop-blur-sm bg-transparent p-0 m-auto max-w-xl w-[90vw] outline-none shadow-2xl"
    >
      <div
        className="rounded-lg border border-white/[0.12] bg-surface-raised text-text overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        onKeyDown={handleKeyNavigation}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.08] bg-surface">
          <Search className="w-4 h-4 text-accent shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to chapter..."
            className="w-full bg-transparent font-sans text-sm text-text placeholder:text-text-dim outline-none"
            autoFocus
          />
          <kbd className="font-mono text-[10px] text-text-dim bg-white/[0.04] border border-white/10 px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => runCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded flex items-center justify-between text-xs font-mono transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-accent/15 text-white border border-accent/40"
                      : "text-text-secondary hover:text-text border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] uppercase text-text-dim px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/[0.06]">
                      {cmd.category}
                    </span>
                    <span className="text-sm font-sans">{cmd.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {cmd.hint && (
                      <span className="text-[11px] text-warm font-mono">{cmd.hint}</span>
                    )}
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-accent" />}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center font-mono text-xs text-text-dim">
              No matching commands or destinations found.
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-surface/80 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-text-dim">
          <span>NAVIGATION: &uarr; &darr; TO SELECT &bull; &crarr; TO EXECUTE</span>
          <span className="text-warm">DIMENSION-K WAYFINDER</span>
        </div>
      </div>
    </dialog>
  );
};

