"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Project } from "@/schemas/content";
import { ArrowUpRight, GitBranch, Sparkles } from "lucide-react";
import Link from "next/link";

interface SelectedProjectsSectionProps {
  projects: Project[];
}

export const SelectedProjectsSection: React.FC<SelectedProjectsSectionProps> = ({
  projects,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Sectors" },
    { id: "developer-tools", label: "Developer Tools" },
    { id: "real-time-systems", label: "Real-Time Systems" },
    { id: "algorithms", label: "Algorithms" },
  ];

  const filtered =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="py-20 lg:py-28 border-b border-white/[0.08] bg-void">
      <Container size="wide">
        <SectionHeading
          index="02"
          eyebrow="Constellation Index"
          title="Selected Engineering Projects"
          description="High-performance developer tools, AST code intelligence, real-time multiplayer engines, and algorithm visualizers."
        />

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-white/[0.06]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-accent/15 border border-accent text-accent font-medium shadow-[0_0_12px_rgba(0,255,238,0.2)]"
                  : "bg-white/[0.02] border border-white/[0.06] text-text-muted hover:text-white hover:border-white/20"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Constellation Grid (Desktop 2-col, Mobile 1-col) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filtered.map((project, idx) => (
            <Card key={project.slug} className="flex flex-col justify-between group">
              <div>
                {/* Sector Coordinate & Index */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-accent">
                      0{idx + 1} //
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
                      {project.category}
                    </span>
                  </div>
                  {project.observatoryCoordinates && (
                    <span className="font-mono text-[11px] text-text-dim px-2 py-0.5 rounded-sm bg-white/[0.03] border border-white/[0.05]">
                      {project.observatoryCoordinates.sector}
                    </span>
                  )}
                </div>

                {/* Title & Tagline */}
                <div className="space-y-1.5 mb-4">
                  <h3 className="text-2xl sm:text-3xl font-normal text-white tracking-tight flex items-center justify-between group-hover:text-accent transition-colors">
                    <span>{project.title}</span>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-text-muted group-hover:text-accent transition-colors p-1"
                      aria-label={`View ${project.title} details`}
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </Link>
                  </h3>
                  <p className="text-xs font-mono text-accent-subtle">
                    {project.tagline}
                  </p>
                </div>

                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                  {project.summary}
                </p>

                {/* Quantitative Telemetry Metrics */}
                {project.metrics && (
                  <div className="grid grid-cols-3 gap-2 p-3 mb-6 bg-white/[0.02] border border-white/[0.06] rounded-lg font-mono text-center">
                    <div>
                      <div className="text-sm sm:text-base font-bold text-accent">
                        {project.metrics.nodes}
                      </div>
                      <div className="text-[10px] text-text-dim uppercase tracking-wider">Nodes</div>
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-bold text-accent">
                        {project.metrics.edges}
                      </div>
                      <div className="text-[10px] text-text-dim uppercase tracking-wider">Edges</div>
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-bold text-accent">
                        {project.metrics.communities}
                      </div>
                      <div className="text-[10px] text-text-dim uppercase tracking-wider">Clusters</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Technologies & Actions */}
              <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-white/[0.03] border border-white/[0.08] text-text-secondary group-hover:border-white/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-2">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <GitBranch className="w-3.5 h-3.5 text-accent" />
                      <span>Repository Source</span>
                    </a>
                  )}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-accent hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Inspect Architecture</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
