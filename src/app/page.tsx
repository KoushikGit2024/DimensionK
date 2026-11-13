import {
  getProfile,
  getProjects,
  getSkillCategories,
  getEducation,
} from "@/lib/content";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { SelectedProjectsSection } from "@/components/sections/SelectedProjectsSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ArchitecturePhilosophySection } from "@/components/sections/ArchitecturePhilosophySection";
import { LogbookSection } from "@/components/sections/LogbookSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ObservatoryCursor } from "@/components/visual/ObservatoryCursor";

export default function Home() {
  const profile = getProfile();
  const projects = getProjects();
  const skills = getSkillCategories();
  const education = getEducation();

  return (
    <div className="relative min-h-screen bg-void flex flex-col selection:bg-accent/20 selection:text-white">
      <ObservatoryCursor />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <HeroSection profile={profile} />
        <SelectedProjectsSection projects={projects} />
        <CapabilitiesSection categories={skills} projects={projects} />
        <ArchitecturePhilosophySection />
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
