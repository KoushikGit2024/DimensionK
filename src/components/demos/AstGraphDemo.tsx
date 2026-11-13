"use client";

import React, { useState } from "react";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  community: number;
  dependencies: string[];
}

const NODES: Node[] = [
  // Community 0: Parser Core (Cyan)
  { id: "ast", label: "AST.ts", x: 60, y: 50, community: 0, dependencies: ["parser", "lexer"] },
  { id: "lexer", label: "Lexer.ts", x: 40, y: 130, community: 0, dependencies: [] },
  { id: "parser", label: "Parser.ts", x: 120, y: 90, community: 0, dependencies: ["lexer"] },

  // Community 1: Graph Topology (Amber)
  { id: "graph", label: "Graph.ts", x: 220, y: 60, community: 1, dependencies: ["ast"] },
  { id: "louvain", label: "Louvain.ts", x: 240, y: 140, community: 1, dependencies: ["graph"] },
  { id: "matrix", label: "Adjacency.ts", x: 320, y: 100, community: 1, dependencies: ["graph", "louvain"] },

  // Community 2: Grounded Docs & AI Context (Purple/Blue)
  { id: "synth", label: "Synthesizer.ts", x: 410, y: 50, community: 2, dependencies: ["matrix"] },
  { id: "prompt", label: "ContextPrompt.ts", x: 440, y: 135, community: 2, dependencies: ["synth"] },
  { id: "docs", label: "ExportDocs.ts", x: 520, y: 90, community: 2, dependencies: ["synth", "prompt"] },
];

const COMMUNITY_COLORS = [
  { fill: "#38f2e6", stroke: "rgba(56, 242, 230, 0.4)" }, // Cyan
  { fill: "#f0a35e", stroke: "rgba(240, 163, 94, 0.4)" }, // Amber
  { fill: "#9d8df1", stroke: "rgba(157, 141, 241, 0.4)" }, // Violet
];

export const AstGraphDemo: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("graph");

  const selectedNode = NODES.find((n) => n.id === selectedNodeId) || NODES[0];
  const activeDependents = NODES.filter(
    (n) => n.id === selectedNodeId || n.dependencies.includes(selectedNodeId) || selectedNode.dependencies.includes(n.id)
  ).map((n) => n.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono text-text-dim border-b border-white/[0.06] pb-2">
        <span>INTERACTIVE AST TOPOLOGY</span>
        <span className="text-accent">Click node to inspect dependency blast radius</span>
      </div>

      <div className="relative rounded-md border border-white/[0.08] bg-void/80 p-3">
        <svg
          viewBox="0 0 560 190"
          className="w-full h-auto cursor-pointer"
          role="img"
          aria-label="Interactive AST dependency graph"
        >
          {/* Edges */}
          {NODES.flatMap((source) =>
            source.dependencies.map((depId) => {
              const target = NODES.find((n) => n.id === depId);
              if (!target) return null;
              const isHighlighted =
                activeDependents.includes(source.id) && activeDependents.includes(target.id);

              return (
                <line
                  key={`${source.id}-${target.id}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHighlighted ? "rgba(56,242,230,0.8)" : "rgba(255,255,255,0.12)"}
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeDasharray={isHighlighted ? undefined : "3 3"}
                  className="transition-all duration-300"
                />
              );
            })
          )}

          {/* Nodes */}
          {NODES.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const isConnected = activeDependents.includes(node.id);
            const color = COMMUNITY_COLORS[node.community];

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className="transition-transform duration-200 hover:scale-110 origin-center cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedNodeId(node.id);
                }}
                aria-label={`Node ${node.label}, community ${node.community}`}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 14 : 11}
                  fill="#0c1018"
                  stroke={isSelected ? color.fill : isConnected ? color.stroke : "rgba(255,255,255,0.2)"}
                  strokeWidth={isSelected ? 3 : 1.5}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 6 : 4}
                  fill={color.fill}
                  opacity={isConnected ? 1 : 0.35}
                />
                <text
                  x={node.x}
                  y={node.y + 24}
                  textAnchor="middle"
                  fill={isSelected ? "#ece7dc" : isConnected ? "#a3a8b3" : "#747c8e"}
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  className="select-none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs font-mono p-3 bg-surface border border-white/[0.06] rounded">
        <div>
          <span className="text-text-dim">SELECTED: </span>
          <span className="text-accent font-semibold">{selectedNode.label}</span>
          <span className="text-text-dim ml-3">COMMUNITY: </span>
          <span className="text-warm">CLUSTER #{selectedNode.community + 1}</span>
        </div>
        <div className="text-text-dim">
          <span>DEPENDENTS IN RADIUS: </span>
          <span className="text-text font-bold">{activeDependents.length}</span>
        </div>
      </div>
    </div>
  );
};

