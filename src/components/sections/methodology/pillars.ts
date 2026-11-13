export interface Pillar {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  summary: string;
  invariant: string;
  referenceSystem: string;
  metricsLabel: string;
}

export const PILLARS: Pillar[] = [
  {
    id: "ast-determinism",
    code: "MOD-01",
    title: "Deterministic Static Intelligence",
    subtitle: "Syntactic Graph Extraction Before Heuristics",
    summary:
      "Rather than relying on probabilistic summaries, codebase intelligence begins with AST parsing—mapping exact module imports, call edges, and strongly connected clusters for deterministic code navigation.",
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
      "Separating pure data structure transformations from React animation loops ensures deterministic stepping, instant frame scrubbing, and zero timer race conditions.",
    invariant: "Step Generator -> Immutable State Snapshot -> UI Frame",
    referenceSystem: "AlgoVisuals Platform",
    metricsLabel: "Frame Determinism",
  },
  {
    id: "systems-foundation",
    code: "MOD-04",
    title: "Hardware-Grounded Systems Discipline",
    subtitle: "Complexity Analysis & Circuit Invariants",
    summary:
      "Formal training in electronics and discrete mathematics at NIT Agartala keeps software grounded in physical reality, algorithmic bounds, and strict hardware constraints.",
    invariant: "Time/Space Complexity Bounds • Clean Module Boundaries",
    referenceSystem: "B.Tech. ECE // NIT Agartala",
    metricsLabel: "Engineering Foundation",
  },
];
