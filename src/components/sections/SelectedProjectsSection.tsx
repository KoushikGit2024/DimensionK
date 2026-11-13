"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, GitBranch } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CountUp } from "@/components/ui/CountUp";
import type { Project } from "@/schemas/content";

interface Props {
  projects: Project[];
}

export const SelectedProjectsSection: React.FC<Props> = ({ projects }) => {
  const [open, setOpen] = useState<string | null>(projects[0]?.slug ?? null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="work" className="py-24 lg:py-36">
      <Container size="wide">
        <SectionHeading
          index="02"
          eyebrow="Selected work"
          title="Things I have built"
          description="Developer tooling, a real-time multiplayer engine, an algorithm visualizer and a full-stack workspace. Open any row for the details."
        />

        <ol className="border-t border-white/[0.08]">
          {projects.map((p, i) => {
            const isOpen = open === p.slug;
            const dimmed = hovered !== null && hovered !== p.slug && !isOpen;
            return (
              <li
                key={p.slug}
                className={`border-b border-white/[0.08] transition-opacity duration-300 ${
                  dimmed ? "opacity-40" : "opacity-100"
                }`}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(p.slug)}
                onPointerLeave={() => setHovered(null)}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`panel-${p.slug}`}
                    data-cursor={isOpen ? "Close" : "Open"}
                    onClick={() => setOpen(isOpen ? null : p.slug)}
                    className="group flex w-full items-baseline gap-4 sm:gap-8 py-6 sm:py-8 text-left outline-none focus-visible:bg-white/[0.03]"
                  >
                    <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-text-dim">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-4xl sm:text-6xl lg:text-7xl leading-none text-text transition-[transform,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-2 group-aria-expanded:text-warm">
                      {p.title}
                    </span>
                    <span className="ml-auto hidden md:block font-mono text-xs uppercase tracking-wider text-text-muted">
                      {p.tagline}
                    </span>
                    <span className="ml-auto md:ml-0 font-mono text-[11px] uppercase text-text-dim">
                      {p.status}
                    </span>
                    <ArrowUpRight
                      className={`h-5 w-5 shrink-0 self-center transition-transform duration-500 ${
                        isOpen
                          ? "rotate-90 text-warm"
                          : "text-text-muted group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      }`}
                    />
                  </button>
                </h3>

                <div
                  id={`panel-${p.slug}`}
                  role="region"
                  aria-label={`${p.title} details`}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-10 pb-10 pl-12 sm:pl-16 lg:grid-cols-12">
                      <div className="lg:col-span-7">
                        <p className="text-base sm:text-lg leading-relaxed text-text-secondary">
                          {p.summary}
                        </p>
                        {p.highlights && (
                          <ul className="mt-6 space-y-3">
                            {p.highlights.map((h, hi) => (
                              <li key={hi} className="flex gap-4 text-sm sm:text-base leading-relaxed text-text-secondary">
                                <span className="font-display text-xl italic leading-none text-warm">{hi + 1}</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="space-y-8 lg:col-span-5">
                        {p.metrics && (
                          <dl className="grid grid-cols-3 gap-4">
                            {Object.entries(p.metrics).map(([k, v]) => (
                              <div key={k} className="flex flex-col-reverse">
                                <dt className="mt-1 font-mono text-[10px] uppercase tracking-widest text-text-dim">{k}</dt>
                                <dd className="font-display text-4xl sm:text-5xl tabular-nums text-accent">
                                  <CountUp value={Number(v)} active={isOpen} />
                                </dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        <p className="font-mono text-xs leading-relaxed text-text-muted">
                          {p.technologies.join(" · ")}
                        </p>
                        <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
                          {p.links.github && (
                            <a href={p.links.github} target="_blank" rel="noopener noreferrer"
                               className="link-draw inline-flex items-center gap-1.5 pb-0.5 text-text-secondary hover:text-text">
                              <GitBranch className="h-3.5 w-3.5 text-accent" /> Source
                            </a>
                          )}
                          <Link href={`/projects/${p.slug}`}
                                className="link-draw inline-flex items-center gap-1 pb-0.5 text-warm">
                            Case study <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
};
