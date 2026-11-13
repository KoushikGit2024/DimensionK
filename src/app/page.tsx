import {
  getProfile,
  getFeaturedProjects,
  getSkillCategories,
  getEducation,
} from "@/lib/content";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { SelectedProjectsSection } from "@/components/sections/SelectedProjectsSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { LogbookSection } from "@/components/sections/LogbookSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ObservatoryCursor } from "@/components/visual/ObservatoryCursor";

export default function Home() {
  const profile = getProfile();
  const projects = getFeaturedProjects();
  const skills = getSkillCategories();
  const education = getEducation();

  return (
    <div className="relative min-h-screen bg-void flex flex-col selection:bg-accent/20 selection:text-white">
      {/* Desktop Custom Observatory Reticle Cursor */}
      <ObservatoryCursor />

      {/* DimensionK Brand & Functional Telemetry Header */}
      <SiteHeader />

      <main className="flex-1">
        <HeroSection profile={profile} />
        <SelectedProjectsSection projects={projects} />
        <CapabilitiesSection categories={skills} />
        <LogbookSection education={education} />
        <ContactSection email={profile.email} links={profile.links} />
      </main>

      <SiteFooter
        displayName={profile.displayName}
        coordinates={profile.coordinates}
        links={profile.links}
      />
    </div>
  );
}
