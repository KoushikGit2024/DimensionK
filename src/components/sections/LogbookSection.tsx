import React from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { TelemetryStamp } from "@/components/ui/TelemetryStamp";
import { EducationEntry } from "@/schemas/content";
import { GraduationCap, MapPin } from "lucide-react";

interface LogbookSectionProps {
  education: EducationEntry[];
}

export const LogbookSection: React.FC<LogbookSectionProps> = ({ education }) => {
  return (
    <section
      id="logbook"
      className="py-20 lg:py-28 border-b border-white/[0.08] bg-void"
    >
      <Container size="wide">
        <SectionHeading
          index="05"
          eyebrow="Chronology & Academic Base"
          title="Education & Engineering Logbook"
          description="Formal academic track providing foundational grounding in computer architecture, digital logic, discrete mathematics, and systems engineering."
          rightMeta={<TelemetryStamp label="CGPA INDEX" value="8.55 / 10.0" />}
        />

        <div className="relative pl-4 sm:pl-8 border-l border-white/[0.12] space-y-8 max-w-5xl">
          {education.map((item, idx) => (
            <Reveal key={item.institution} delay={idx * 0.08}>
              <div className="relative">
                {/* Meridian Timeline Node */}
                <div
                  aria-hidden="true"
                  className="absolute -left-[21px] sm:-left-[37px] top-6 w-2.5 h-2.5 rounded-full bg-void border-2 border-accent shadow-[0_0_10px_rgba(56,242,230,0.7)]"
                />

                <Card className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.07] font-mono text-xs">
                    <div className="flex items-center gap-2 text-accent font-medium uppercase tracking-wider">
                      <GraduationCap className="w-4 h-4" />
                      <span>{item.period}</span>
                    </div>
                    {item.cgpa && (
                      <span className="px-2.5 py-0.5 rounded-xs bg-accent/12 border border-accent/35 text-accent font-medium">
                        CGPA: {item.cgpa}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-normal text-white tracking-tight">
                      {item.degree} — {item.field}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-text-muted">
                      <span className="text-text-secondary font-medium">
                        {item.institution}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-text-dim">
                        <MapPin className="w-3 h-3 text-accent" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  {item.highlights && item.highlights.length > 0 && (
                    <ul className="pt-2 space-y-2 border-t border-white/[0.05]">
                      {item.highlights.map((h, hIdx) => (
                        <li
                          key={hIdx}
                          className="text-xs sm:text-sm text-text-secondary leading-relaxed flex items-start gap-2.5"
                        >
                          <span className="font-mono text-xs text-accent mt-0.5">
                            ::
                          </span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
