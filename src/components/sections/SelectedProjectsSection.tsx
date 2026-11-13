"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { Project } from "@/schemas/content";
import Link from "next/link";

interface SelectedProjectsSectionProps {
  projects: Project[];
}

export const SelectedProjectsSection: React.FC<SelectedProjectsSectionProps> = ({
  projects,
}) => {
  return (
    <section id="work" className="py-16 lg:py-24 border-b border-border/30 bg-void">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block"
            >
              <div className="h-full p-8 rounded-2xl bg-surface/50 border border-border/60 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-normal text-white tracking-tight group-hover:text-accent transition-colors">
                    {project.title} — {project.tagline}
                  </h3>
                </div>

                {/* Pill Tags matching the mockup */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-3.5 py-1.5 rounded-full text-xs font-normal bg-surface-raised border border-border text-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};
