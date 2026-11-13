"use client";

import React from "react";
import { Pillar } from "./pillars";
import { Card } from "@/components/ui/Card";
import { AstGraphDemo } from "@/components/demos/AstGraphDemo";
import { StateSyncDemo } from "@/components/demos/StateSyncDemo";
import { StepScrubberDemo } from "@/components/demos/StepScrubberDemo";
import { LogicGateDemo } from "@/components/demos/LogicGateDemo";

interface PillarPanelProps {
  pillar: Pillar;
}

export const PillarPanel: React.FC<PillarPanelProps> = ({ pillar }) => {
  const renderInteractiveDemo = (id: string) => {
    switch (id) {
      case "ast-determinism":
        return <AstGraphDemo />;
      case "realtime-state":
        return <StateSyncDemo />;
      case "decoupled-playback":
        return <StepScrubberDemo />;
      case "systems-foundation":
        return <LogicGateDemo />;
      default:
        return null;
    }
  };

  return (
    <Card
      role="tabpanel"
      id="pillar-panel"
      aria-labelledby={`tab-${pillar.id}`}
      className="h-full justify-between border-white/[0.1] bg-surface/80"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/[0.08] font-mono text-xs">
          <span className="text-accent uppercase tracking-widest">
            ARCHITECTURAL SPECIFICATION // {pillar.code}
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

        {/* Live Interactive Working Demonstration */}
        <div className="pt-2">
          {renderInteractiveDemo(pillar.id)}
        </div>

        <div className="p-4 rounded-md bg-surface border border-white/[0.08] space-y-2 font-mono">
          <div className="text-[10px] uppercase tracking-widest text-text-dim">
            Core System Invariant & Pipeline
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

