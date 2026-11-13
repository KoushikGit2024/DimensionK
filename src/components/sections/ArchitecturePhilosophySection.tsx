"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { GitBranch, Activity, Cpu, Layers } from "lucide-react";

interface Pillar {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  summary: string;
  invariant: string;
  referenceSystem: string;
  metricsLabel: string;
}

const PILLARS: Pillar[] = [
  {
    id: "ast-determinism",
    code: "MOD-01",
    title: "Deterministic Static Intelligence",
    subtitle: "Syntactic Graph Extraction Before Heuristics",
    summary:
      "Rather than relying on probabilistic summaries, repository exploration begins with Abstract Syntax Tree (AST) parsing—mapping exact module imports, call edges, and strongly connected clusters.",
    invariant: "1,468 Nodes • 2,760 Directed Edges • 138 Communities",
    referenceSystem: "CodeLens Architecture",
    metricsLabel: "AST Graph Resolution",
  },
  {
    id: "realtime-state",
    code: "MOD-02",
    title: "Atomic State & Low-Latency Synchronization",
    subtitle: "Bidirectional Event Loops with Session Recovery",
    summary:
      "Multiplayer and distributed engines demand deterministic turn propagation, automated bot fallback state machines, and atomic in-memory persistence so disconnected clients reconcile state cleanly.",
    invariant: "Socket.IO Event Pipeline + RedisJSON In-Memory Document Store",
    referenceSystem: "Ludo Neo Engine",
    metricsLabel: "State Persistence Layer",
  },
  {
    id: "decoupled-playback",
    code: "MOD-03",
    title: "Decoupled Execution & Visual Tracing",
    subtitle: "Pure Algorithmic State Traces vs. Render Frames",
    summary:
      "Separating pure data structure transformations from React animation loops ensures deterministic stepping, instant frame scrubbing, and predictable rendering across complex graph and tree traversals.",
    invariant: "Step Generator -> Immutable State Snapshot -> UI Frame",
    referenceSystem: "AlgoVisuals Platform",
    metricsLabel: "Frame Determinism",
  },
  {
    id: "systems-foundation",
    code: "MOD-04",
    title: "Hardware-Grounded Systems Discipline",
    subtitle: "Complexity Analysis & Architectural Rigor",
    summary:
      "Combining formal training in electronics, computer architecture, and discrete mathematics at NIT Agartala with algorithmic optimization in C++ keeps web and distributed architectures grounded in runtime constraints.",
    invariant: "Time/Space Complexity Bounds • Clean Module Boundaries",
    referenceSystem: "B.Tech. ECE // NIT Agartala",
    metricsLabel: "Engineering Foundation",
  },
];

export const ArchitecturePhilosophySection: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(PILLARS[0].id);
  const activePillar =
    PILLARS.find((p) => p.id === activeId) || PILLARS[0];

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
    <section
      id="methodology"
      className="py-20 lg:py-28 border-b border-white/[0.08] bg-deep-space-grid"
    >
      <Container size="wide">
        <SectionHeading
          index="04"
          eyebrow="Engineering Philosophy"
          title="Systems Methodology & Problem-Solving"
          description="Every project is engineered around explicit state invariants, predictable data flow, and measurable runtime performance."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Interactive Pillar Selector */}
          <div
            role="tablist"
            aria-label="Engineering methodology pillars"
            className="lg:col-span-5 flex flex-col justify-between gap-3"
          >
            {PILLARS.map((pillar, idx) => {
              const active = pillar.id === activeId;
              return (
                <div key={pillar.id} role="presentation">
                  <Reveal delay={idx * 0.05}>
                    <button
                      type="button"
                      role="tab"
                      id={`tab-${pillar.id}`}
                      aria-controls="pillar-panel"
                      aria-selected={active}
                      onClick={() => setActiveId(pillar.id)}
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
                      <div className="text-base sm:text-lg font-normal text-white">
                        {pillar.title}
                      </div>
                      <div className="text-xs font-mono text-text-muted mt-1">
                        {pillar.subtitle}
                      </div>
                    </button>
                  </Reveal>
                </div>
              );
            })}
          </div>

          {/* Right Architectural Blueprint Readout */}
          <div className="lg:col-span-7">
            <Card
              role="tabpanel"
              id="pillar-panel"
              aria-labelledby={`tab-${activeId}`}
              className="h-full justify-between border-white/[0.1] bg-surface/80"
            >
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/[0.08] font-mono text-xs">
                  <span className="text-accent uppercase tracking-widest">
                    ARCHITECTURAL SPECIFICATION // {activePillar.code}
                  </span>
                  <span className="text-text-muted">
                    REF: {activePillar.referenceSystem}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                    {activePillar.title}
                  </h3>
                  <p className="font-mono text-xs sm:text-sm text-accent-subtle">
                    {activePillar.subtitle}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  {activePillar.summary}
                </p>

                <div className="p-4 rounded-md bg-surface border border-white/[0.08] space-y-2 font-mono">
                  <div className="text-[10px] uppercase tracking-widest text-text-dim">
                    Core System Invariant & Pipeline
                  </div>
                  <div className="text-xs sm:text-sm text-accent font-medium">
                    {activePillar.invariant}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.07] flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[10px] text-text-dim uppercase block">
                    Primary Focus
                  </span>
                  <span className="text-text font-medium">
                    {activePillar.metricsLabel}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-text-dim uppercase block">
                    Architecture Reference
                  </span>
                  <span className="text-accent font-medium">
                    {activePillar.referenceSystem}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};
