import {
  getProfile,
  getProjects,
  getSkillCategories,
  getEducation,
} from "@/lib/content";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container } from "@/components/layout/Container";
import { ScrollReadText } from "@/components/ui/ScrollReadText";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { MethodologySection } from "@/components/sections/methodology/MethodologySection";
import { LogbookSection } from "@/components/sections/LogbookSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ObservatoryCursor } from "@/components/visual/ObservatoryCursor";

export default function Home() {
  const profile = getProfile();
  const projects = getProjects();
  const skills = getSkillCategories();
  const education = getEducation();
  const codelens = projects.find((p) => p.slug === "codelens");

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-accent/20 selection:text-white">
      <ObservatoryCursor />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <HeroSection
          profile={profile}
          projectCount={projects.length}
          codelensMetrics={codelens?.metrics}
        />

        {profile.statement && (
          <section id="statement" className="py-28 lg:py-44">
            <Container size="narrow">
              <p className="mb-8 font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
                Before the work
              </p>
              <ScrollReadText
                text={profile.statement}
                className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.18] text-text"
              />
            </Container>
          </section>
        )}

        <ProjectsSection projects={projects} />
        <CapabilitiesSection categories={skills} projects={projects} />
        <MethodologySection />
        <LogbookSection education={education} />
        <ContactSection links={profile.links} />
      </main>

      <SiteFooter
        displayName={profile.displayName}
        coordinates={profile.coordinates}
        links={profile.links}
      />
    </div>
  );
}
