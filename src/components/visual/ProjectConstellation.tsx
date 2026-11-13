"use client";

import React, { useState } from "react";
import type { Project } from "@/schemas/content";

const raHours = (s: string) => {
  const m = s.match(/(\d+)h\s*(\d+)?m?/);
  return m ? Number(m[1]) + Number(m[2] ?? 0) / 60 : 0;
};

export const ProjectConstellation: React.FC<{
  projects: Project[];
  onSelect?: (slug: string) => void;
  className?: string;
}> = ({ projects, onSelect, className = "" }) => {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const pts = projects
    .filter((p) => p.observatoryCoordinates)
    .map((p, i) => {
      const hours = raHours(p.observatoryCoordinates!.sector);
      return {
        slug: p.slug,
        title: p.title,
        tagline: p.tagline,
        sector: p.observatoryCoordinates!.sector,
        magnitude: p.observatoryCoordinates!.magnitude,
        x: 60 + (hours / 24) * 520,
        y: 110 + Math.sin(i * 1.9) * 60 + i * 16,
        r: Math.max(3.5, 9 - Number(p.observatoryCoordinates!.magnitude) * 1.2),
      };
    });

  const hoveredProject = pts.find((p) => p.slug === hoveredSlug);

  return (
    <div className={`relative p-6 rounded-lg border border-white/[0.08] bg-surface/40 ${className}`}>
      <div className="flex items-center justify-between font-mono text-xs text-text-dim border-b border-white/[0.06] pb-3 mb-2">
        <span className="uppercase tracking-widest text-accent flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span>CELESTIAL SPHERE // ASCENSION CONSTELLATION MAP</span>
        </span>
        <span className="text-text-muted">EPOCH J2026.5</span>
      </div>

      <svg
        viewBox="0 0 640 220"
        className="w-full h-auto"
        role="img"
        aria-label="Celestial constellation map plotting projects by right ascension coordinates and brightness magnitude"
      >
        {/* Coordinate Grid lines */}
        {[0, 6, 12, 18, 24].map((h) => {
          const x = 60 + (h / 24) * 520;
          return (
            <g key={h}>
              <line
                x1={x}
                y1={20}
                x2={x}
                y2={200}
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="2 3"
              />
              <text
                x={x}
                y={212}
                textAnchor="middle"
                fill="#747c8e"
                fontSize="9"
                fontFamily="var(--font-mono)"
              >
                {h}h
              </text>
            </g>
          );
        })}

        {/* Constellation line connecting projects in sequence */}
        <polyline
          points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="rgba(56, 242, 230, 0.4)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Star Points */}
        {pts.map((pt) => {
          const isHovered = hoveredSlug === pt.slug;

          return (
            <g
              key={pt.slug}
              className="cursor-pointer transition-transform duration-200 origin-center"
              onMouseEnter={() => setHoveredSlug(pt.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              onClick={() => {
                if (onSelect) {
                  onSelect(pt.slug);
                } else {
                  const el = document.getElementById(`project-${pt.slug}`);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  const el = document.getElementById(`project-${pt.slug}`);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              {/* Outer halo */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? pt.r * 2.8 : pt.r * 1.8}
                fill={isHovered ? "rgba(240,163,94,0.15)" : "rgba(56,242,230,0.08)"}
                className="transition-all duration-300"
              />
              {/* Star Core */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? pt.r * 1.4 : pt.r}
                fill={isHovered ? "#f0a35e" : "#38f2e6"}
                stroke="#0c1018"
                strokeWidth={1.5}
                className="transition-all duration-300 shadow-[0_0_12px_rgba(56,242,230,0.8)]"
              />
              <text
                x={pt.x}
                y={pt.y - (isHovered ? 14 : 10)}
                textAnchor="middle"
                fill={isHovered ? "#ece7dc" : "#8c93a3"}
                fontSize="10"
                fontFamily="var(--font-mono)"
                className="select-none font-semibold transition-colors duration-200"
              >
                {pt.title}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Dynamic Hover Legend */}
      <div className="mt-2 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
        {hoveredProject ? (
          <div>
            <span className="text-warm font-semibold">{hoveredProject.title}</span>
            <span className="text-text-dim mx-2">&bull;</span>
            <span className="text-text-secondary">{hoveredProject.tagline}</span>
          </div>
        ) : (
          <span className="text-text-dim">
            Hover or click any star to jump to its engineering case study.
          </span>
        )}
        {hoveredProject && (
          <span className="text-text-dim shrink-0">
            {hoveredProject.sector} &bull; MAG {hoveredProject.magnitude}
          </span>
        )}
      </div>
    </div>
  );
};

