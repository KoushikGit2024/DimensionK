import React from "react";

export const CodeLensDiagram: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`p-6 rounded-lg border border-white/[0.08] bg-surface/50 font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between text-text-dim text-[11px] mb-4 pb-2 border-b border-white/[0.06]">
        <span>SYSTEM ARCHITECTURE // REPOSITORY PIPELINE</span>
        <span className="text-accent">AST &rarr; GRAPH &rarr; COMMUNITY &rarr; DOCS</span>
      </div>
      <svg
        viewBox="0 0 680 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-text"
        role="img"
        aria-label="CodeLens architecture diagram showing parsing of source code into AST, graph construction, community detection, and grounded documentation."
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="rgba(56, 242, 230, 0.6)" />
          </marker>
        </defs>

        {/* Connection Lines */}
        <line x1="140" y1="90" x2="190" y2="90" stroke="rgba(56, 242, 230, 0.5)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow)" />
        <line x1="320" y1="90" x2="370" y2="90" stroke="rgba(56, 242, 230, 0.5)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow)" />
        <line x1="500" y1="90" x2="550" y2="90" stroke="rgba(240, 163, 94, 0.6)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow)" />

        {/* Step 1: Source & AST */}
        <g>
          <rect x="10" y="45" width="130" height="90" rx="6" fill="#0c1018" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
          <circle cx="26" cy="62" r="3.5" fill="#38f2e6" />
          <text x="36" y="66" fill="#8c93a3" fontSize="10">01 // PARSE</text>
          <text x="26" y="92" fill="#ece7dc" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Babel AST</text>
          <text x="26" y="112" fill="#747c8e" fontSize="9">Imports & Symbols</text>
        </g>

        {/* Step 2: Directed Graph */}
        <g>
          <rect x="190" y="45" width="130" height="90" rx="6" fill="#0c1018" stroke="rgba(56, 242, 230, 0.3)" strokeWidth="1" />
          <circle cx="206" cy="62" r="3.5" fill="#38f2e6" />
          <text x="216" y="66" fill="#38f2e6" fontSize="10">02 // TOPOLOGY</text>
          <text x="206" y="92" fill="#ece7dc" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Dependency Graph</text>
          <text x="206" y="112" fill="#747c8e" fontSize="9">1,468 Nodes • 2,760 Edges</text>
        </g>

        {/* Step 3: Modularity Clustering */}
        <g>
          <rect x="370" y="45" width="130" height="90" rx="6" fill="#0c1018" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
          <circle cx="386" cy="62" r="3.5" fill="#38f2e6" />
          <text x="396" y="66" fill="#8c93a3" fontSize="10">03 // PARTITION</text>
          <text x="386" y="92" fill="#ece7dc" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Louvain Cluster</text>
          <text x="386" y="112" fill="#747c8e" fontSize="9">138 Module Communities</text>
        </g>

        {/* Step 4: Grounded Docs & AI Context */}
        <g>
          <rect x="550" y="45" width="120" height="90" rx="6" fill="#0c1018" stroke="rgba(240, 163, 94, 0.4)" strokeWidth="1" />
          <circle cx="566" cy="62" r="3.5" fill="#f0a35e" />
          <text x="576" y="66" fill="#f0a35e" fontSize="10">04 // SYNTHESIS</text>
          <text x="566" y="92" fill="#ece7dc" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Grounded Docs</text>
          <text x="566" y="112" fill="#747c8e" fontSize="9">Deterministic AI Flow</text>
        </g>
      </svg>
    </div>
  );
};

