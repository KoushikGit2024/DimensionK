"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PILLARS } from "./pillars";
import { PillarTabs } from "./PillarTabs";
import { PillarPanel } from "./PillarPanel";

export const MethodologySection: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(PILLARS[0].id);
  const activePillar =
    PILLARS.find((p) => p.id === activeId) || PILLARS[0];

  return (
    <section
      id="methodology"
      className="py-20 lg:py-28 border-b border-white/[0.08]"
    >
      <Container size="wide">
        <SectionHeading
          index="03"
          eyebrow="Engineering Philosophy"
          title="Systems Methodology & Problem-Solving"
          description="Every system is engineered around explicit state invariants, predictable data flow, and verifiable runtime performance. Explore each proof-of-concept below."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <div className="lg:col-span-5">
            <PillarTabs
              pillars={PILLARS}
              activeId={activeId}
              onSelect={setActiveId}
            />
          </div>

          <div className="lg:col-span-7">
            <PillarPanel pillar={activePillar} />
          </div>
        </div>
      </Container>
    </section>
  );
};
