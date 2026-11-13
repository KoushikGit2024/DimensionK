"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CountUp } from "@/components/ui/CountUp";
import { ProjectConstellation } from "@/components/visual/ProjectConstellation";
import { ProjectPreviewWindow } from "@/components/ui/ProjectPreviewWindow";
import type { Project } from "@/schemas/content";

interface Props {
  projects: Project[];
}

export const ProjectsSection: React.FC<Props> = ({ projects }) => {
  const [open, setOpen] = useState<string | null>(projects[0]?.slug ?? null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="work" className="py-24 lg:py-36">
      <Container size="wide">
        <SectionHeading
          index="01"
          eyebrow="Projects"
          title="Things I have built"
        />

        <ol className="border-t border-white/[0.08]">
          {projects.map((p, i) => {
            const isOpen = open === p.slug;
            const dimmed = hovered !== null && hovered !== p.slug && !isOpen;
            return (
              <li
                key={p.slug}
                id={`project-${p.slug}`}
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
                    <div className="grid gap-8 pb-12 pt-2 pl-4 sm:pl-12 lg:grid-cols-12 items-start">
                      {/* Left Side: Real Visual / Live IFrame Preview Window */}
                      <div className="lg:col-span-7">
                        <ProjectPreviewWindow
                          title={p.title}
                          tagline={p.tagline}
                          summary={p.summary}
                          technologies={p.technologies}
                          previewUrl={p.previewUrl || p.links.demo}
                          pageUrl={p.pageUrl}
                          githubUrl={p.links.github}
                          previewImage={p.previewImage}
                          aspectRatio="video"
                        />
                      </div>

                      {/* Right Side: Editorial Context & Metric Stats */}
                      <div className="space-y-6 lg:col-span-5">
                        <p className="text-base sm:text-lg leading-relaxed text-text-secondary font-sans">
                          {p.summary}
                        </p>

                        {p.highlights && (
                          <ul className="space-y-2.5">
                            {p.highlights.slice(0, 2).map((h, hi) => (
                              <li key={hi} className="flex gap-3 text-xs sm:text-sm leading-relaxed text-text-secondary">
                                <span className="font-display text-lg italic leading-none text-warm">{hi + 1}</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {p.metrics && (
                          <dl className="grid grid-cols-3 gap-3 border-t border-b border-white/[0.08] py-4">
                            {Object.entries(p.metrics).map(([k, v]) => (
                              <div key={k} className="flex flex-col-reverse">
                                <dt className="mt-1 font-mono text-[9px] uppercase tracking-widest text-text-dim">{k}</dt>
                                <dd className="font-display text-2xl sm:text-3xl tabular-nums text-accent">
                                  <CountUp value={Number(v)} active={isOpen} />
                                </dd>
                              </div>
                            ))}
                          </dl>
                        )}

                        <div className="flex flex-wrap items-center gap-2">
                          {p.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded bg-surface border border-white/[0.08] font-mono text-[11px] text-text-muted"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-6 font-mono text-xs pt-2">
                          {p.links.github && (
                            <a
                              href={p.links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-draw inline-flex items-center gap-1.5 text-text-secondary hover:text-text"
                            >
                              <GitHubIcon className="h-3.5 w-3.5 text-accent" /> Source Code
                            </a>
                          )}
                          <Link
                            href={`/projects/${p.slug}`}
                            className="link-draw inline-flex items-center gap-1 text-warm font-semibold"
                          >
                            Read In Details <ArrowUpRight className="h-3.5 w-3.5" />
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
