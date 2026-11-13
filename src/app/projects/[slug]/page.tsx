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
import { buttonStyles } from "@/components/ui/Button";
import { ObservatoryCursor } from "@/components/visual/ObservatoryCursor";
import { ProjectPreviewWindow } from "@/components/ui/ProjectPreviewWindow";
import {
  ArrowLeft,
  ArrowRight,
  GitBranch,
  ArrowUpRight,
  Layers,
  Cpu,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
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
      {/* Top Breadcrumb */}
      <div className="mb-10 flex items-center justify-between gap-4">
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

      {/* Hero Header */}
      <header className="space-y-6 pb-12 border-b border-white/[0.08]">
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

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display text-text tracking-tight font-normal">
            {project.title}
          </h1>
          <p className="text-xl sm:text-2xl text-accent font-light">
            {project.tagline}
          </p>
        </div>

        <p className="max-w-3xl text-base sm:text-lg text-text-secondary leading-relaxed font-sans">
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

      {/* Main Two-Column Layout with Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 my-12">
        {/* Left Column: Narrative Editorial Write-up */}
        <div className="lg:col-span-8 space-y-12">
          {/* Real Website Preview / Screenshot Window */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Interactive Interface Inspection</span>
            </h2>
            <ProjectPreviewWindow
              title={project.title}
              tagline={project.tagline}
              summary={project.summary}
              technologies={project.technologies}
              demoUrl={project.links.demo}
              githubUrl={project.links.github}
              previewImage={project.previewImage}
              aspectRatio="wide"
            />
          </section>

          {/* Problem Statement */}
          {project.story?.problem && (
            <section className="space-y-4">
              <h2 className="font-mono text-xs uppercase tracking-widest text-warm flex items-center gap-2">
                <span className="font-display italic text-base">§</span>
                <span>The Problem & Invariants</span>
              </h2>
              <p className="font-display text-xl sm:text-2xl text-text leading-relaxed font-normal">
                {project.story.problem}
              </p>
            </section>
          )}

          {/* Hard Constraints */}
          {project.story?.constraints && project.story.constraints.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-muted flex items-center gap-2">
                <span>01 // Hard Engineering Constraints</span>
              </h2>
              <div className="p-6 bg-surface/50 border border-white/[0.08] rounded-lg space-y-3">
                {project.story.constraints.map((constraint, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                    <span className="text-accent font-mono text-xs mt-0.5">&bull;</span>
                    <span>{constraint}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Architectural Decisions */}
          {project.story?.decisions && project.story.decisions.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-accent flex items-center gap-2">
                <span>02 // Architectural Decisions & Tradeoffs</span>
              </h2>
              <div className="space-y-6">
                {project.story.decisions.map((decision, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-surface/50 border border-white/[0.08] rounded-lg grid grid-cols-1 md:grid-cols-12 gap-6"
                  >
                    <div className="md:col-span-5 space-y-2">
                      <div className="font-mono text-[10px] text-accent uppercase tracking-widest">
                        DECISION // 0{idx + 1}
                      </div>
                      <h3 className="font-display text-lg text-text font-normal">
                        {decision.title}
                      </h3>
                    </div>
                    <div className="md:col-span-7 space-y-3 text-sm leading-relaxed">
                      <p className="text-text-secondary font-sans">{decision.why}</p>
                      {decision.tradeoff && (
                        <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded text-xs text-text-dim">
                          <strong className="text-warm font-mono uppercase text-[10px] block mb-1">
                            Accepted Tradeoff:
                          </strong>
                          {decision.tradeoff}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* What Was Hardest */}
          {project.story?.hardest && (
            <section className="space-y-3 p-6 bg-white/[0.02] border border-white/[0.08] rounded-lg">
              <h2 className="font-mono text-xs uppercase tracking-widest text-warm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warm" />
                <span>What Was Hardest</span>
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans">
                {project.story.hardest}
              </p>
            </section>
          )}

          {/* Mistakes & What I'd Change */}
          {project.story?.mistakes && (
            <section className="space-y-3 p-6 bg-surface/40 border border-white/[0.08] rounded-lg">
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-muted flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent" />
                <span>What I Learned & What I&apos;d Change</span>
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans">
                {project.story.mistakes}
              </p>
            </section>
          )}

          {/* Technical Highlights Fallback / Addition */}
          {project.highlights && project.highlights.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-mono text-xs uppercase tracking-widest text-accent flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Implementation Highlights</span>
              </h2>
              <ul className="space-y-3">
                {project.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="p-5 bg-surface/50 border border-white/[0.08] rounded-md text-sm text-text-secondary leading-relaxed flex items-start gap-3.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Sticky Specification Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Quantitative Metrics */}
            {project.metrics && (
              <Card spotlight={false} className="space-y-4">
                <div className="font-mono text-xs text-accent uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span>Quantitative Metrics</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 font-mono text-center">
                  {Object.entries(project.metrics).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 bg-surface border border-white/[0.07] rounded-xs"
                    >
                      <div className="text-xl sm:text-2xl font-bold text-accent tabular-nums">
                        {Number(val).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-text-dim uppercase tracking-widest mt-1">
                        {key}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Stack & Coordinates */}
            <Card spotlight={false} className="space-y-5">
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-muted border-b border-white/[0.07] pb-3">
                // Specification & Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <Badge key={t} variant="mono" className="text-xs px-2.5 py-1">
                    {t}
                  </Badge>
                ))}
              </div>

              <div className="pt-4 border-t border-white/[0.07] space-y-2.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-text-dim">CATEGORY</span>
                  <span className="text-text uppercase">
                    {project.category.replaceAll("-", " ")}
                  </span>
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
          </div>
        </aside>
      </div>

      {/* Sequential Constellation Navigation */}
      <nav
        aria-label="Adjacent project case studies"
        className="mt-16 pt-8 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        <Link
          href={`/projects/${prevProject.slug}`}
          className="p-6 rounded-lg border border-white/[0.08] bg-surface/50 hover:border-warm transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-dim flex items-center gap-1.5">
              <ArrowLeft className="w-3 h-3 text-warm" />
              <span>Previous Sector</span>
            </span>
            <div className="font-display text-xl text-text group-hover:text-warm transition-colors">
              {prevProject.title}
            </div>
            <p className="text-xs text-text-muted line-clamp-1">
              {prevProject.tagline}
            </p>
          </div>
        </Link>

        <Link
          href={`/projects/${nextProject.slug}`}
          className="p-6 rounded-lg border border-white/[0.08] bg-surface/50 hover:border-warm transition-all group flex items-center justify-between text-right"
        >
          <div className="space-y-1 ml-auto">
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-dim flex items-center justify-end gap-1.5">
              <span>Next Sector</span>
              <ArrowRight className="w-3 h-3 text-warm" />
            </span>
            <div className="font-display text-xl text-text group-hover:text-warm transition-colors">
              {nextProject.title}
            </div>
            <p className="text-xs text-text-muted line-clamp-1">
              {nextProject.tagline}
            </p>
          </div>
        </Link>
      </nav>
    </Container>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const profile = getProfile();

  return (
    <div className="min-h-screen text-text flex flex-col relative selection:bg-accent/20 selection:text-white">
      <ObservatoryCursor />
      <SiteHeader />

      <main id="main-content" className="flex-1 py-12 sm:py-16">
        <Suspense
          fallback={
            <Container size="default">
              <div className="py-24 text-center font-mono text-sm text-text-dim animate-pulse">
                Accessing Observatory Sector Archives...
              </div>
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
