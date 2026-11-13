import React from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkillCategory } from "@/schemas/content";

interface CapabilitiesSectionProps {
  categories: SkillCategory[];
}

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({
  categories,
}) => {
  return (
    <section id="capabilities" className="py-20 lg:py-28 border-b border-border-subtle bg-deep-space-grid">
      <Container size="wide">
        <SectionHeading
          index="03"
          eyebrow="Instruments & Competencies"
          title="Technical Capabilities"
          description="Concrete technologies, architectural paradigms, and systems engineering methodologies used in production and research."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="space-y-4">
              <div className="border-b border-border-subtle pb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-accent">
                  // {category.title}
                </span>
              </div>

              <ul className="space-y-2.5">
                {category.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="flex items-center justify-between text-xs sm:text-sm font-mono text-text-secondary"
                  >
                    <span className={skill.highlight ? "text-text font-medium" : ""}>
                      {skill.name}
                    </span>
                    {skill.highlight && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

