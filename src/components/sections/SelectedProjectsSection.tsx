"use client";

import React, { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { TelemetryStamp } from "@/components/ui/TelemetryStamp";
import { Project } from "@/schemas/content";
import {
  ArrowUpRight,
  GitBranch,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";
import Link from "next/link";

interface SelectedProjectsSectionProps {
  projects: Project[];
}

const CATEGORIES = [
  { id: "all", label: "All Sectors" },
  { id: "developer-tools", label: "Developer Tools" },
  { id: "real-time-systems", label: "Real-Time Systems" },
  { id: "algorithms", label: "Algorithms" },
  { id: "web-applications", label: "Web Applications" },
];

export const SelectedProjectsSection: React.FC<
  SelectedProjectsSectionProps
> = ({ projects }) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedSlug, setExpandedSlug] = useState<string | null>("codelens");

  const filtered = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory, projects]);

  const toggleExpand = (slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <section
      id="work"
      className="py-20 lg:py-28 border-b border-white/[0.08] bg-void relative"
    >
      <Container size="wide">
        <SectionHeading
          index="02"
          eyebrow="Constellation Index"
          title="Selected Engineering Projects"
          description="Production-grade developer tooling, AST repository intelligence, real-time multiplayer state engines, and deterministic algorithm visualizers."
          rightMeta={
            <TelemetryStamp
              label="ACTIVE SYSTEMS"
              value={`${filtered.length} / 0${projects.length}`}
            />
          }
        />

        {/* Sector Filter Bar */}
        <div
          role="tablist"
          aria-label="Filter engineering projects by sector"
          className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-white/[0.06]"
        >
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === "all"
                ? projects.length
                : projects.filter((p) => p.category === cat.id).length;
            if (count === 0) return null;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? "bg-accent/15 border-accent text-accent font-medium"
                    : "bg-white/[0.02] border-white/[0.07] text-text-muted hover:text-white hover:border-white/20"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-xs ${
                    isActive
                      ? "bg-accent/20 text-white"
                      : "bg-white/[0.04] text-text-dim"
                  }`}
                >
                  0{count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Asymmetric Editorial Constellation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {filtered.map((project, idx) => {
            const isLeadFeatured =
              activeCategory === "all" && idx === 0 && project.featured;
            const isExpanded = expandedSlug === project.slug;

            return (
              <Reveal
                key={project.slug}
                delay={idx * 0.06}
                className={
                  isLeadFeatured ? "lg:col-span-12" : "lg:col-span-6"
                }
              >
                <Card
                  className={`h-full group transition-all ${
                    isLeadFeatured
                      ? "border-accent/25 bg-gradient-to-br from-surface-raised/90 via-surface/85 to-void"
                      : ""
                  }`}
                >
                  {/* Top Telemetry Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-white/[0.07]">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs text-accent font-semibold">
                        0{idx + 1} //
                      </span>
                      <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">
                        {project.category.replace("-", " ")}
                      </span>
                      <Badge variant="status" className="uppercase">
                        {project.status}
                      </Badge>
                    </div>

                    {project.observatoryCoordinates && (
                      <div className="flex items-center gap-2 font-mono text-[11px] text-text-dim px-2.5 py-0.5 rounded-xs bg-white/[0.03] border border-white/[0.06]">
                        <span>{project.observatoryCoordinates.sector}</span>
                        <span>•</span>
                        <span className="text-accent-subtle">
                          MAG {project.observatoryCoordinates.magnitude}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Main Body (2-column split on Lead Featured desktop card) */}
                  <div
                    className={
                      isLeadFeatured
                        ? "grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-6"
                        : "space-y-4 mb-6 flex-1"
                    }
                  >
                    <div
                      className={
                        isLeadFeatured ? "lg:col-span-7 space-y-4" : "space-y-4"
                      }
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-2xl sm:text-3xl font-normal text-white tracking-tight group-hover:text-accent transition-colors">
                            <Link
                              href={`/projects/${project.slug}`}
                              className="outline-none focus-visible:underline"
                            >
                              {project.title}
                            </Link>
                          </h3>
                          <Link
                            href={`/projects/${project.slug}`}
                            className="text-text-muted hover:text-accent transition-colors p-1.5 rounded-xs border border-transparent hover:border-white/[0.1]"
                            aria-label={`Open full case study for ${project.title}`}
                          >
                            <ArrowUpRight className="w-5 h-5" />
                          </Link>
                        </div>
                        <p className="text-xs sm:text-sm font-mono text-accent-subtle">
                          {project.tagline}
                        </p>
                      </div>

                      <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                        {project.summary}
                      </p>

                      {/* Quantitative Metrics Strip */}
                      {project.metrics && (
                        <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-void/70 border border-white/[0.07] rounded-md font-mono">
                          {Object.entries(project.metrics).map(([k, val]) => (
                            <div key={k} className="text-center">
                              <div className="text-base sm:text-lg font-bold text-accent tabular-nums">
                                {Number(val).toLocaleString()}
                              </div>
                              <div className="text-[10px] text-text-dim uppercase tracking-widest mt-0.5">
                                {k}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Architecture Highlights Inspector */}
                    <div
                      className={
                        isLeadFeatured
                          ? "lg:col-span-5 bg-void/60 border border-white/[0.07] rounded-md p-4 sm:p-5 space-y-3"
                          : "pt-2"
                      }
                    >
                      {project.highlights && project.highlights.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-accent" />
                              <span>Architecture Highlights</span>
                            </span>
                            {!isLeadFeatured && (
                              <button
                                type="button"
                                onClick={() => toggleExpand(project.slug)}
                                aria-expanded={isExpanded}
                                aria-controls={`highlights-${project.slug}`}
                                className="inline-flex items-center gap-1 font-mono text-[11px] text-accent hover:text-white transition-colors cursor-pointer py-1 px-2 rounded-xs bg-white/[0.03]"
                              >
                                <span>
                                  {isExpanded ? "Collapse" : "Inspect Specs"}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>

                          {(isLeadFeatured || isExpanded) && (
                            <ul
                              id={`highlights-${project.slug}`}
                              className="mt-3 space-y-2.5 border-t border-white/[0.06] pt-3"
                            >
                              {project.highlights.map((item, hIdx) => (
                                <li
                                  key={hIdx}
                                  className="text-xs sm:text-sm text-text-secondary leading-relaxed flex items-start gap-2.5"
                                >
                                  <span className="font-mono text-[11px] text-accent mt-0.5 shrink-0">
                                    0{hIdx + 1}.
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Technologies & Links */}
                  <div className="mt-auto pt-4 border-t border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-xs text-[11px] font-mono bg-white/[0.03] border border-white/[0.08] text-text-secondary group-hover:border-white/15 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-5 text-xs font-mono shrink-0">
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-muted hover:text-white inline-flex items-center gap-1.5 transition-colors"
                        >
                          <GitBranch className="w-3.5 h-3.5 text-accent" />
                          <span>Source</span>
                        </a>
                      )}
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-accent hover:text-white inline-flex items-center gap-1 font-medium transition-colors"
                      >
                        <span>Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
