 "use client";

import React from "react";
import { Pillar } from "./pillars";
import { Card } from "@/components/ui/Card";
import { Terminal, ShieldCheck } from "lucide-react";

interface PillarPanelProps {
  pillar: Pillar;
}

export const PillarPanel: React.FC<PillarPanelProps> = ({ pillar }) => {
  return (
    <Card
      role="tabpanel"
      id="pillar-panel"
      aria-labelledby={`tab-${pillar.id}`}
      className="h-full justify-between border-white/[0.1] bg-surface/80"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/[0.08] font-mono text-xs">
          <span className="text-accent uppercase tracking-widest flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>ARCHITECTURAL SPECIFICATION // {pillar.code}</span>
          </span>
          <span className="text-text-muted">
            REF: {pillar.referenceSystem}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-normal text-text tracking-tight font-display">
            {pillar.title}
          </h3>
          <p className="font-mono text-xs sm:text-sm text-accent">
            {pillar.subtitle}
          </p>
        </div>

        <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans">
          {pillar.summary}
        </p>

        {/* Engineering Rigor & State Invariant Panel */}
        <div className="p-5 rounded-lg bg-surface-raised border border-white/[0.08] space-y-3 font-mono">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-text-dim border-b border-white/[0.06] pb-2">
            <span className="flex items-center gap-1.5 text-accent">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Core Invariant Specification</span>
            </span>
            <span>VERIFIED</span>
          </div>
          <div className="text-xs sm:text-sm text-warm font-medium">
            {pillar.invariant}
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-white/[0.07] flex items-center justify-between font-mono text-xs">
        <div>
          <span className="text-[10px] text-text-dim uppercase block">
            Primary Focus
          </span>
          <span className="text-text font-medium">
            {pillar.metricsLabel}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-text-dim uppercase block">
            Architecture Reference
          </span>
          <span className="text-accent font-medium">
            {pillar.referenceSystem}
          </span>
        </div>
      </div>
    </Card>
  );
};
