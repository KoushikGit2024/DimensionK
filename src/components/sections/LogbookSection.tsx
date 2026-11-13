import React from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EducationEntry } from "@/schemas/content";

interface LogbookSectionProps {
  education: EducationEntry[];
}

export const LogbookSection: React.FC<LogbookSectionProps> = ({ education }) => {
  return (
    <section id="logbook" className="py-20 lg:py-28 border-b border-white/[0.08] bg-void">
      <Container size="wide">
        <SectionHeading
          index="04"
          eyebrow="Chronology & Academic Base"
          title="Education & Engineering Logbook"
          description="Formal academic track providing foundational grounding in hardware architectures, digital logic, and mathematics."
        />

        <div className="space-y-6 max-w-4xl">
          {education.map((item) => (
            <div
              key={item.institution}
              className="relative pl-6 sm:pl-8 border-l border-white/[0.12] space-y-2 py-2"
            >
              {/* Telemetry node point */}
              <div className="absolute -left-[5px] top-4 w-2.5 h-2.5 rounded-full bg-void border border-accent shadow-[0_0_8px_rgba(0,255,238,0.6)]" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                <span className="text-accent uppercase tracking-wider font-medium">
                  {item.period}
                </span>
                {item.cgpa && (
                  <span className="text-text-muted">
                    CGPA: <strong className="text-white">{item.cgpa}</strong>
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-normal text-white">
                {item.degree} in {item.field}
              </h3>

              <div className="text-xs font-mono text-text-dim">
                {item.institution} • {item.location}
              </div>

              {item.highlights && item.highlights.length > 0 && (
                <ul className="pt-2 space-y-1">
                  {item.highlights.map((h, hIdx) => (
                    <li
                      key={hIdx}
                      className="text-xs sm:text-sm text-text-secondary leading-relaxed list-disc list-inside"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
