"use client";

import React, { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillCategory, Project } from "@/schemas/content";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface CapabilitiesSectionProps {
  categories: SkillCategory[];
  projects?: Project[];
}

const ALIAS_MAP: Record<string, string[]> = {
  "Redis / RedisJSON": ["redis", "redisjson"],
  "MongoDB / Atlas": ["mongodb", "mongodb atlas"],
  "React.js": ["react"],
  "Node.js": ["node.js", "node"],
  "Express.js": ["express.js", "express"],
  "Data Structures & Algorithms": ["data structures", "algorithms"],
  "Object-Oriented Design": ["c++", "object-oriented design"],
  "Complexity Analysis": ["algorithms", "c++", "complexity analysis"],
  "REST APIs": ["rest", "rest api", "rest apis", "express.js"],
  "Git / GitHub": ["git", "github"],
  "Render / Vercel": ["render", "vercel"],
};

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({
  categories,
  projects = [],
}) => {
  const [filterLevel, setFilterLevel] = useState<"all" | "strong">("all");
  const [selectedSkill, setSelectedSkill] = useState<string>("TypeScript");

  // Derive matching projects dynamically with fuzzy aliases
  const matchedProjects = useMemo(() => {
    const searchTargets = [
      selectedSkill.toLowerCase(),
      ...(ALIAS_MAP[selectedSkill]?.map((a) => a.toLowerCase()) || []),
    ];

    return projects.filter((p) =>
      p.technologies.some((tech) =>
        searchTargets.some((target) => tech.toLowerCase().includes(target) || target.includes(tech.toLowerCase()))
      )
    );
  }, [projects, selectedSkill]);

  return (
    <section
      id="capabilities"
      className="py-24 lg:py-32 border-b border-white/[0.08] relative"
    >
      {/* Subtle ambient cyan/indigo backdrop glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_20%_40%,rgba(56,189,248,0.07),transparent_70%)]"
      />

      <Container size="wide">
        <SectionHeading
          index="02"
          eyebrow="Instruments & Competencies"
          title="Technical Capabilities Matrix"
          description="A fluid typographic inventory of systems languages, architectural invariants, and distributed engineering tooling."
          rightMeta={
            <div
              role="group"
              aria-label="Filter capabilities by proficiency"
              className="inline-flex rounded-xs border border-white/[0.1] bg-surface-raised p-1 font-mono text-xs shadow-inner"
            >
              <button
                type="button"
                onClick={() => setFilterLevel("all")}
                aria-pressed={filterLevel === "all"}
                className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
                  filterLevel === "all"
                    ? "bg-accent/15 text-accent font-medium shadow-[0_0_8px_rgba(56,242,230,0.2)]"
                    : "text-text-muted hover:text-white"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterLevel("strong")}
                aria-pressed={filterLevel === "strong"}
                className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
                  filterLevel === "strong"
                    ? "bg-warm/20 text-warm font-medium shadow-[0_0_8px_rgba(240,163,94,0.2)]"
                    : "text-text-muted hover:text-white"
                }`}
              >
                Core Only
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12 items-start">
          {/* Left Column: Sticky Editorial Dynamic Statement with Chromatic Edge */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 p-8 rounded-lg border border-white/[0.1] bg-surface/70 glass-edge-cyan shadow-xl">
            <div className="font-mono text-xs uppercase tracking-widest text-accent flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(56,242,230,0.8)]" />
                <span>INSTRUMENT TELEMETRY</span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-accent/60" />
            </div>

            <p className="font-display text-3xl sm:text-4xl text-text leading-[1.2] font-normal">
              <span className="text-warm font-medium">{selectedSkill}</span> is built into{" "}
              {matchedProjects.length > 0 ? (
                <span>
                  {matchedProjects.map((p, idx) => (
                    <React.Fragment key={p.slug}>
                      {idx > 0 && (idx === matchedProjects.length - 1 ? " and " : ", ")}
                      <Link
                        href={`/projects/${p.slug}`}
                        className="text-text hover:text-warm link-draw font-semibold inline-flex items-center gap-0.5"
                      >
                        {p.title}
                        <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                      </Link>
                    </React.Fragment>
                  ))}
                  .
                </span>
              ) : (
                <span className="text-text-secondary font-sans text-xl sm:text-2xl block mt-2">
                  foundational coursework, algorithmic analysis, and core systems engineering.
                </span>
              )}
            </p>

            <div className="pt-4 border-t border-white/[0.08] font-mono text-xs text-text-dim flex items-center justify-between">
              <span>PROJECT OCCURRENCES</span>
              <span className="text-accent font-bold tabular-nums">
                0{matchedProjects.length} ARCHITECTURE{matchedProjects.length === 1 ? "" : "S"}
              </span>
            </div>
          </div>

          {/* Right Column: Flowing Typographic Categories */}
          <div className="lg:col-span-7 space-y-10">
            {categories.map((category) => {
              const visibleSkills =
                filterLevel === "all"
                  ? category.skills
                  : category.skills.filter((s) => s.proficiency === "strong");

              if (visibleSkills.length === 0) return null;

              return (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 font-mono text-xs">
                    <span className="uppercase tracking-widest text-accent font-semibold flex items-center gap-2">
                      <span className="text-accent/60">//</span>
                      <span>{category.title}</span>
                    </span>
                    <span className="text-text-dim font-bold">0{visibleSkills.length}</span>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3">
                    {visibleSkills.map((skill) => {
                      const isSelected = selectedSkill === skill.name;
                      const isStrong = skill.proficiency === "strong";

                      return (
                        <button
                          key={skill.name}
                          type="button"
                          onClick={() => setSelectedSkill(skill.name)}
                          className="relative py-1 group text-left cursor-pointer transition-colors focus:outline-none"
                        >
                          <span
                            className={`transition-all duration-200 ${
                              isStrong
                                ? "font-display text-xl sm:text-2xl text-text hover:text-warm"
                                : "font-sans text-sm sm:text-base text-text-secondary hover:text-text"
                            } ${
                              isSelected
                                ? "text-warm font-semibold drop-shadow-[0_0_8px_rgba(240,163,94,0.4)]"
                                : ""
                            }`}
                          >
                            {skill.name}
                          </span>

                          {/* Animated sliding ember underline using layoutId */}
                          {isSelected && (
                            <motion.span
                              layoutId="activeSkillUnderline"
                              className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-warm shadow-[0_0_10px_rgba(240,163,94,0.7)]"
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
