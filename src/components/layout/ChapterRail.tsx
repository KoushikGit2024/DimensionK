"use client";

import React from "react";
import { useActiveSection } from "@/hooks/useActiveSection";

const CHAPTERS = [
  { id: "hero", roman: "O", label: "Horizon" },
  { id: "work", roman: "I", label: "Projects" },
  { id: "capabilities", roman: "II", label: "Capabilities" },
  { id: "methodology", roman: "III", label: "Methodology" },
  { id: "logbook", roman: "IV", label: "Logbook" },
  { id: "contact", roman: "V", label: "Transmission" },
];

export const ChapterRail: React.FC = () => {
  const activeId = useActiveSection(CHAPTERS.map((c) => c.id));

  return (
    <nav
      aria-label="Chapter index"
      className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-6"
    >
      {CHAPTERS.map((chapter) => {
        const isActive = activeId === chapter.id;

        return (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-label={`${chapter.label} chapter`}
            className="group relative flex items-center gap-3 py-1 text-left focus:outline-none"
          >
            <span
              className={`font-display text-lg tracking-tight transition-all duration-300 ${
                isActive
                  ? "text-warm scale-125 font-bold italic"
                  : "text-text-dim group-hover:text-text"
              }`}
            >
              {chapter.roman}
            </span>

            {/* Hover tooltip label */}
            <span className="absolute left-8 px-2 py-0.5 rounded bg-surface border border-white/10 font-mono text-[10px] uppercase tracking-wider text-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
              {chapter.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
};

