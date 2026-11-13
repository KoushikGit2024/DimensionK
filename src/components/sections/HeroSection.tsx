import React from "react";
import { Container } from "@/components/layout/Container";
import { Profile } from "@/schemas/content";
import { ObservatoryVisualEngine } from "@/visual-engine/ObservatoryVisualEngine";
import { Button } from "@/components/ui/Button";
import { ArrowDown, Send, Sparkles } from "lucide-react";

interface HeroSectionProps {
  profile: Profile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  return (
    <section
      id="about"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-void border-b border-white/[0.08] cosmic-radial-depth"
    >
      {/* 3D Living Galactic Core & Starfield Engine */}
      <ObservatoryVisualEngine />

      <Container size="wide" className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Editorial Headline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/[0.08] text-accent text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Observatory Station // {profile.coordinates}</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-white uppercase font-sans">
                {profile.displayName}
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-light text-accent-subtle tracking-normal">
                {profile.headline}
              </p>
            </div>

            <p className="max-w-xl text-sm sm:text-base text-text-secondary leading-relaxed">
              {profile.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#work">
                <Button variant="primary" size="lg" className="border-white/[0.15] hover:border-accent">
                  <span>Explore Constellation Works</span>
                  <ArrowDown className="w-4 h-4 text-accent" />
                </Button>
              </a>
              <a href="#contact">
                <Button variant="secondary" size="lg" className="border-white/[0.1] hover:border-white/30">
                  <span>Open Transmission</span>
                  <Send className="w-4 h-4 text-text-muted" />
                </Button>
              </a>
            </div>
          </div>

          {/* Right Spatial Depth Anchor (3D Galaxy sits here) */}
          <div className="hidden lg:block lg:col-span-5 h-[480px] pointer-events-none" />
        </div>
      </Container>
    </section>
  );
};
