"use client";

import React, { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SkillCategory, Project } from "@/schemas/content";
import { Terminal, Cpu, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface CapabilitiesSectionProps {
  categories: SkillCategory[];
  projects?: Project[];
}

const SKILL_PROJECT_MAP: Record<string, string[]> = {
  "C++": ["algovisuals"],
  TypeScript: ["codelens"],
  JavaScript: ["algovisuals", "ludo-neo", "remidos"],
  "Data Structures & Algorithms": ["codelens", "algovisuals", "ludo-neo"],
  "Object-Oriented Design": ["codelens", "ludo-neo"],
  "Complexity Analysis": ["codelens", "algovisuals"],
  "Node.js": ["codelens", "ludo-neo", "remidos"],
  "Express.js": ["remidos", "ludo-neo"],
  "Socket.IO": ["ludo-neo"],
  "REST APIs": ["remidos", "codelens"],
  "Redis / RedisJSON": ["ludo-neo"],
  "MongoDB / Atlas": ["remidos"],
  "React.js": ["codelens", "ludo-neo", "algovisuals", "remidos"],
  "Next.js": ["codelens"],
  "Tailwind CSS": ["algovisuals", "codelens"],
  "Git / GitHub": ["codelens", "ludo-neo", "algovisuals", "remidos"],
  "Render / Vercel": ["remidos", "ludo-neo"],
};

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({
  categories,
  projects = [],
}) => {
  const [filterLevel, setFilterLevel] = useState<"all" | "strong">("all");
  const [selectedSkill, setSelectedSkill] = useState<string>("TypeScript");

  const relatedProjectSlugs = SKILL_PROJECT_MAP[selectedSkill] || [];
  const matchedProjects = useMemo(
    () => projects.filter((p) => relatedProjectSlugs.includes(p.slug)),
    [projects, relatedProjectSlugs]
  );

  return (
    <section
      id="capabilities"
      className="py-20 lg:py-28 border-b border-white/[0.08] bg-void"
    >
      <Container size="wide">
        <SectionHeading
          index="03"
          eyebrow="Instruments & Competencies"
          title="Technical Capabilities Matrix"
          description="Production languages, computer science core fundamentals, and real-time distributed systems tooling—cross-referenced with active deployments."
          rightMeta={
            <div
              role="group"
              aria-label="Filter capabilities by proficiency"
              className="inline-flex rounded-xs border border-white/[0.08] bg-surface p-1 font-mono text-xs"
            >
              <button
                type="button"
                onClick={() => setFilterLevel("all")}
                aria-pressed={filterLevel === "all"}
                className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
                  filterLevel === "all"
                    ? "bg-accent/15 text-accent font-medium"
                    : "text-text-muted hover:text-white"
                }`}
              >
                All Instruments
              </button>
              <button
                type="button"
                onClick={() => setFilterLevel("strong")}
                aria-pressed={filterLevel === "strong"}
                className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
                  filterLevel === "strong"
                    ? "bg-accent/15 text-accent font-medium"
                    : "text-text-muted hover:text-white"
                }`}
              >
                Core / Primary
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, idx) => {
            const visibleSkills =
              filterLevel === "all"
                ? category.skills
                : category.skills.filter((s) => s.proficiency === "strong");

            return (
              <Reveal key={category.id} delay={idx * 0.06}>
                <Card className="h-full space-y-4">
                  <div className="border-b border-white/[0.07] pb-3 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-accent font-medium">
                      // {category.title}
                    </span>
                    <span className="font-mono text-[10px] text-text-dim">
                      0{visibleSkills.length}
                    </span>
                  </div>

                  <ul className="space-y-2 flex-1">
                    {visibleSkills.map((skill) => {
                      const isSelected = selectedSkill === skill.name;
                      const isStrong = skill.proficiency === "strong";

                      return (
                        <li key={skill.name}>
                          <button
                            type="button"
                            onClick={() => setSelectedSkill(skill.name)}
                            className={`w-full text-left px-2.5 py-2 rounded-xs font-mono text-xs transition-all flex items-center justify-between cursor-pointer border ${
                              isSelected
                                ? "bg-accent/12 border-accent/50 text-white"
                                : "bg-white/[0.015] border-transparent hover:border-white/[0.08] text-text-secondary hover:text-white"
                            }`}
                          >
                            <span
                              className={
                                skill.highlight
                                  ? "text-white font-medium"
                                  : "text-text-secondary"
                              }
                            >
                              {skill.name}
                            </span>

                            <span className="flex items-center gap-2">
                              <span className="text-[10px] uppercase text-text-dim">
                                {isStrong ? "CORE" : "WORK"}
                              </span>
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  skill.highlight
                                    ? "bg-accent shadow-[0_0_8px_rgba(56,242,230,0.8)]"
                                    : "bg-white/25"
                                }`}
                              />
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {/* Interactive Skill-to-Architecture Cross-Reference Bar */}
        <div className="mt-8 p-5 sm:p-6 rounded-lg border border-white/[0.08] bg-surface/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs text-accent">
              <Terminal className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider">
                Instrument Telemetry // {selectedSkill}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">
              {matchedProjects.length > 0
                ? `Actively deployed across ${matchedProjects.length} verified engineering architecture(s) in the constellation index.`
                : "Foundational computer science & systems engineering competency applied across architectural design and coursework."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {matchedProjects.length > 0 ? (
              matchedProjects.map((proj) => (
                <Link
                  key={proj.slug}
                  href={`/projects/${proj.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs font-mono text-xs bg-void border border-accent/30 text-text hover:border-accent hover:text-accent transition-colors"
                >
                  <Cpu className="w-3.5 h-3.5 text-accent" />
                  <span>{proj.title}</span>
                  <ArrowUpRight className="w-3 h-3 text-text-dim" />
                </Link>
              ))
            ) : (
              <span className="font-mono text-xs text-text-dim px-3 py-1.5 border border-white/[0.06] rounded-xs bg-void">
                SYSTEMS CORE FOUNDATION // NIT AGARTALA
              </span>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};
