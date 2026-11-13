import React from "react";

export const AlgoVisualsDiagram: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`p-6 rounded-lg border border-white/[0.08] bg-surface/50 font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between text-text-dim text-[11px] mb-4 pb-2 border-b border-white/[0.06]">
        <span>EXECUTION DECOUPLING // IMMUTABLE STEP PIPELINE</span>
        <span className="text-accent">GENERATOR &bull; TIMELINE ARRAY &bull; REACT FRAME</span>
      </div>
      <svg
        viewBox="0 0 680 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-text"
        role="img"
        aria-label="AlgoVisuals architecture diagram illustrating how algorithm steps are pre-computed as snapshots, decoupling execution logic from UI scrubber rendering."
      >
        <defs>
          <marker id="arrow-algo" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="rgba(56, 242, 230, 0.6)" />
          </marker>
        </defs>

        {/* Lines */}
        <line x1="180" y1="85" x2="240" y2="85" stroke="rgba(56, 242, 230, 0.5)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-algo)" />
        <line x1="420" y1="85" x2="480" y2="85" stroke="rgba(240, 163, 94, 0.6)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-algo)" />

        {/* Stage 1: Pure Algorithm Function */}
        <g>
          <rect x="20" y="40" width="160" height="90" rx="6" fill="#0c1018" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
          <circle cx="36" cy="58" r="3.5" fill="#38f2e6" />
          <text x="46" y="62" fill="#8c93a3" fontSize="10">PURE GENERATOR</text>
          <text x="36" y="88" fill="#ece7dc" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Algorithm Core</text>
          <text x="36" y="108" fill="#747c8e" fontSize="9">Zero React Dependencies</text>
        </g>

        {/* Stage 2: Step Snapshot Timeline */}
        <g>
          <rect x="240" y="40" width="180" height="90" rx="6" fill="#0c1018" stroke="rgba(56, 242, 230, 0.3)" strokeWidth="1" />
          <circle cx="256" cy="58" r="3.5" fill="#38f2e6" />
          <text x="266" y="62" fill="#38f2e6" fontSize="10">IMMUTABLE SNAPSHOTS</text>
          <text x="256" y="88" fill="#ece7dc" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">[Frame 0 ... Frame N]</text>
          <text x="256" y="108" fill="#747c8e" fontSize="9">Deterministic Timeline Buffer</text>
        </g>

        {/* Stage 3: Scrubbable UI Renderer */}
        <g>
          <rect x="480" y="40" width="180" height="90" rx="6" fill="#0c1018" stroke="rgba(240, 163, 94, 0.4)" strokeWidth="1" />
          <circle cx="496" cy="58" r="3.5" fill="#f0a35e" />
          <text x="506" y="62" fill="#f0a35e" fontSize="10">SCRUBBER & VIEW</text>
          <text x="496" y="88" fill="#ece7dc" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Frame Scrubber UI</text>
          <text x="496" y="108" fill="#747c8e" fontSize="9">Zero Re-eval Glitches</text>
        </g>
      </svg>
    </div>
  );
};

