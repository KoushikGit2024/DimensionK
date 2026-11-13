import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjects, getProjectBySlug, getProfile } from "@/lib/content";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { TelemetryStamp } from "@/components/ui/TelemetryStamp";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, GitBranch, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — Observatory Project Case Study`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const profile = getProfile();

  if (!project) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-void flex flex-col selection:bg-accent/20 selection:text-white">
      <SiteHeader coordinates={profile.coordinates} />

      <main className="flex-1 pt-28 pb-20">
        <Container size="narrow">
          <div className="mb-10">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Constellation Index</span>
            </Link>
          </div>

          <header className="space-y-4 pb-8 border-b border-border-subtle">
            <div className="flex flex-wrap items-center gap-3">
              <TelemetryStamp
                label="SECTOR"
                value={project.observatoryCoordinates?.sector || "GENERAL"}
              />
              <Badge variant="status" className="uppercase">
                {project.status}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-normal text-text tracking-tight">
              {project.title}
            </h1>

            <p className="text-lg sm:text-xl font-light text-accent">
              {project.tagline}
            </p>

            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              {project.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="md">
                    <GitBranch className="w-4 h-4 text-accent" />
                    <span>View GitHub Repository</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-text-dim" />
                  </Button>
                </a>
              )}
            </div>
          </header>

          {project.metrics && (
            <div className="my-10 p-6 bg-surface border border-border rounded-sm">
              <span className="font-mono text-xs text-text-muted uppercase tracking-wider block mb-4">
                // System Telemetry & Quantitative Metrics
              </span>
              <div className="grid grid-cols-3 gap-4 font-mono text-center">
                {Object.entries(project.metrics).map(([key, val]) => (
                  <div key={key} className="p-3 bg-void border border-border-subtle rounded-xs">
                    <div className="text-lg sm:text-2xl font-bold text-accent">
                      {val}
                    </div>
                    <div className="text-xs text-text-dim uppercase tracking-wider mt-1">
                      {key}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.highlights && project.highlights.length > 0 && (
            <section className="my-10 space-y-4">
              <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
                // Technical Architecture & Implementation
              </h2>
              <ul className="space-y-3">
                {project.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="p-4 bg-surface/60 border border-border-subtle rounded-xs text-sm text-text-secondary leading-relaxed flex items-start gap-3"
                  >
                    <span className="text-accent font-mono text-xs mt-0.5">
                      0{i + 1}.
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="my-10 space-y-4 pt-6 border-t border-border-subtle">
            <h2 className="font-mono text-xs uppercase tracking-widest text-text-muted">
              // Instrumentation & Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <Badge key={t} variant="mono" className="text-xs px-2.5 py-1">
                  {t}
                </Badge>
              ))}
            </div>
          </section>
        </Container>
      </main>

      <SiteFooter
        displayName={profile.displayName}
        coordinates={profile.coordinates}
        links={profile.links}
      />
    </div>
  );
}
