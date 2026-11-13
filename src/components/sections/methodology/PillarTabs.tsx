"use client";

import React from "react";
import { Pillar } from "./pillars";
import { GitBranch, Activity, Cpu, Layers } from "lucide-react";

interface PillarTabsProps {
  pillars: Pillar[];
  activeId: string;
  onSelect: (id: string) => void;
}

export const PillarTabs: React.FC<PillarTabsProps> = ({
  pillars,
  activeId,
  onSelect,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case "ast-determinism":
        return <GitBranch className="w-4 h-4 text-accent" />;
      case "realtime-state":
        return <Activity className="w-4 h-4 text-accent" />;
      case "decoupled-playback":
        return <Layers className="w-4 h-4 text-accent" />;
      default:
        return <Cpu className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Engineering methodology pillars"
      className="flex flex-col justify-between gap-3"
    >
      {pillars.map((pillar) => {
        const active = pillar.id === activeId;
        return (
          <button
            key={pillar.id}
            type="button"
            role="tab"
            id={`tab-${pillar.id}`}
            aria-controls="pillar-panel"
            aria-selected={active}
            onClick={() => onSelect(pillar.id)}
            className={`w-full text-left p-4 sm:p-5 rounded-md border transition-all cursor-pointer ${
              active
                ? "bg-surface-raised border-accent/60 shadow-[0_0_24px_rgba(56,242,230,0.08)]"
                : "bg-surface/60 border-white/[0.07] hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between font-mono text-xs mb-1.5">
              <span
                className={
                  active ? "text-accent font-semibold" : "text-text-dim"
                }
              >
                {pillar.code} // {pillar.referenceSystem}
              </span>
              {getIcon(pillar.id)}
            </div>
            <div className="text-base sm:text-lg font-normal text-text">
              {pillar.title}
            </div>
            <div className="text-xs font-mono text-text-muted mt-1">
              {pillar.subtitle}
            </div>
          </button>
        );
      })}
    </div>
  );
};

