import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getProjects, getProjectBySlug, getProfile } from "@/lib/content";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { TelemetryStamp } from "@/components/ui/TelemetryStamp";
import { Button, buttonStyles } from "@/components/ui/Button";
import { ObservatoryCursor } from "@/components/visual/ObservatoryCursor";
import {
  ArrowLeft,
  ArrowRight,
  GitBranch,
  ArrowUpRight,
  Layers,
  Cpu,
} from "lucide-react";
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
    title: `${project.title} — Observatory Engineering Case Study`,
    description: project.summary,
  };
}

async function ProjectContent({ params }: ProjectPageProps) {
  const { slug } = await params;
  const allProjects = getProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);

  if (currentIndex === -1) {
    notFound();
  }

  const project = allProjects[currentIndex];
  const prevProject =
    allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <Container size="default">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-accent transition-colors py-1.5 px-3 rounded-xs border border-white/[0.07] bg-white/[0.02]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-accent" />
          <span>Return to Constellation Index</span>
        </Link>

        <span className="font-mono text-xs text-text-dim hidden sm:inline">
          CASE STUDY // 0{currentIndex + 1} OF 0{allProjects.length}
        </span>
      </div>

      <header className="space-y-5 pb-10 border-b border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-2.5">
          <TelemetryStamp
            label="SECTOR"
            value={project.observatoryCoordinates?.sector || "GENERAL"}
          />
          {project.observatoryCoordinates?.magnitude && (
            <TelemetryStamp
              label="MAGNITUDE"
              value={project.observatoryCoordinates.magnitude}
            />
          )}
          <Badge variant="status" className="uppercase">
            {project.status}
          </Badge>
          <Badge variant="mono">{project.category.replaceAll("-", " ")}</Badge>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight">
            {project.title}
          </h1>
          <p className="text-lg sm:text-2xl font-light text-accent-subtle">
            {project.tagline}
          </p>
        </div>

        <p className="max-w-3xl text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed">
          {project.summary}
        </p>

        <div className="flex flex-wrap items-center gap-3.5 pt-2">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles("primary", "md")}
            >
              <GitBranch className="w-4 h-4 text-accent" />
              <span>Inspect GitHub Repository</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-text-dim" />
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles("secondary", "md")}
            >
              <span>Launch Live Deployment</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
            </a>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-10">
        {/* Main Technical Architecture Column */}
        <div className="lg:col-span-8 space-y-8">
          {project.metrics && (
            <Card spotlight={false} className="space-y-4">
              <div className="font-mono text-xs text-accent uppercase tracking-widest flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span>System Telemetry & Quantitative Metrics</span>
              </div>
              <div className="grid grid-cols-3 gap-4 font-mono text-center">
                {Object.entries(project.metrics).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-4 bg-void border border-white/[0.07] rounded-xs"
                  >
                    <div className="text-xl sm:text-3xl font-bold text-accent tabular-nums">
                      {Number(val).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-text-dim uppercase tracking-widest mt-1">
                      {key}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {project.highlights && project.highlights.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-mono text-xs uppercase tracking-widest text-accent flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Technical Architecture & Implementation Highlights</span>
              </h2>
              <ul className="space-y-3.5">
                {project.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="p-5 bg-surface-glass border border-white/[0.08] rounded-md text-sm sm:text-base text-text-secondary leading-relaxed flex items-start gap-3.5"
                  >
                    <span className="text-accent font-mono text-xs px-2 py-0.5 bg-accent/10 border border-accent/30 rounded-xs shrink-0 mt-0.5">
                      0{i + 1}
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Specification Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <Card spotlight={false} className="space-y-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-text-muted border-b border-white/[0.07] pb-3">
              // Instrumentation Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <Badge key={t} variant="mono" className="text-xs px-3 py-1">
                  {t}
                </Badge>
              ))}
            </div>

            <div className="pt-4 border-t border-white/[0.07] space-y-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-text-dim">CATEGORY</span>
                <span className="text-text uppercase">{project.category.replaceAll("-", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">STATUS</span>
                <span className="text-accent uppercase">{project.status}</span>
              </div>
              {project.observatoryCoordinates && (
                <div className="flex justify-between">
                  <span className="text-text-dim">COORDINATES</span>
                  <span className="text-text">
                    {project.observatoryCoordinates.sector}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </aside>
      </div>

      {/* Sequential Constellation Navigation */}
      <nav
        aria-label="Adjacent project case studies"
        className="mt-14 pt-8 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Link
          href={`/projects/${prevProject.slug}`}
          className="p-5 rounded-md border border-white/[0.08] bg-surface/60 hover:border-accent transition-colors group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-dim flex items-center gap-1.5">
              <ArrowLeft className="w-3 h-3 text-accent" />
              <span>Previous Sector</span>
            </span>
            <div className="text-base sm:text-lg text-white group-hover:text-accent transition-colors">
              {prevProject.title}
            </div>
          </div>
          <span className="font-mono text-xs text-text-dim hidden sm:inline">
            {prevProject.observatoryCoordinates?.sector}
          </span>
        </Link>

        <Link
          href={`/projects/${nextProject.slug}`}
          className="p-5 rounded-md border border-white/[0.08] bg-surface/60 hover:border-accent transition-colors group flex items-center justify-between text-right"
        >
          <span className="font-mono text-xs text-text-dim hidden sm:inline">
            {nextProject.observatoryCoordinates?.sector}
          </span>
          <div className="space-y-1 ml-auto">
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-dim flex items-center justify-end gap-1.5">
              <span>Next Sector</span>
              <ArrowRight className="w-3 h-3 text-accent" />
            </span>
            <div className="text-base sm:text-lg text-white group-hover:text-accent transition-colors">
              {nextProject.title}
            </div>
          </div>
        </Link>
      </nav>
    </Container>
  );
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const profile = getProfile();

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-accent/20 selection:text-white">
      <ObservatoryCursor />
      <SiteHeader />

      <main id="main-content" className="flex-1 pt-28 pb-20">
        <Suspense
          fallback={
            <Container
              size="default"
              className="py-20 text-center font-mono text-sm text-text-muted"
            >
              SYNCHRONIZING PROJECT TELEMETRY...
            </Container>
          }
        >
          <ProjectContent params={params} />
        </Suspense>
      </main>

      <SiteFooter
        displayName={profile.displayName}
        coordinates={profile.coordinates}
        links={profile.links}
      />
    </div>
  );
}
