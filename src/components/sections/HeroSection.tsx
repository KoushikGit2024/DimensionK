import React from "react";
import { Container } from "@/components/layout/Container";
import { Profile } from "@/schemas/content";
import { ObservatoryVisualEngine } from "@/visual-engine/ObservatoryVisualEngine";
import { ObservatoryGridOverlay } from "@/components/visual/ObservatoryGridOverlay";

interface HeroSectionProps {
  profile: Profile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  return (
    <section
      id="about"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-void border-b border-border/40"
    >
      {/* Precision Observatory Coordinate Grid Lines */}
      <ObservatoryGridOverlay />

      {/* 3D Celestial Wireframe Engine */}
      <ObservatoryVisualEngine />

      <Container size="wide" className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Editorial Headline matching mockup */}
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-white uppercase font-sans">
              {profile.displayName}
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-text-secondary tracking-normal">
              {profile.headline}
            </p>
          </div>

          {/* Right Space Anchor reserving focal room for the 3D Celestial Sphere */}
          <div className="hidden lg:block lg:col-span-5 h-[480px]" />
        </div>
      </Container>
    </section>
  );
};
