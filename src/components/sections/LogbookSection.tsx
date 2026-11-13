"use client";

import React, { useRef } from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TelemetryStamp } from "@/components/ui/TelemetryStamp";
import { EducationEntry } from "@/schemas/content";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { MapPin } from "lucide-react";

interface LogbookSectionProps {
  education: EducationEntry[];
}

export const LogbookSection: React.FC<LogbookSectionProps> = ({ education }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.5"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const cgpaValue = education.find((e) => e.cgpa)?.cgpa;

  return (
    <section
      id="logbook"
      className="py-20 lg:py-28 border-b border-white/[0.08]"
    >
      <Container size="wide">
        <SectionHeading
          index="04"
          eyebrow="Chronology & Academic Base"
          title="Education & Engineering Logbook"
          description="Formal academic track providing foundational grounding in computer architecture, digital logic, discrete mathematics, and systems engineering."
          rightMeta={
            cgpaValue ? (
              <TelemetryStamp
                label="CGPA INDEX"
                value={`${cgpaValue} / 10.0`}
              />
            ) : null
          }
        />

        <div ref={containerRef} className="relative mt-16 max-w-4xl pl-6 sm:pl-10">
          {/* Background track line */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-3 bottom-3 w-[1px] bg-white/[0.1]"
          />

          {/* Self-drawing active timeline line */}
          <motion.div
            aria-hidden="true"
            className="absolute left-0 top-3 w-[2px] -ml-[0.5px] bg-gradient-to-b from-accent via-accent to-warm origin-top"
            style={{ height: reduce ? "100%" : lineHeight }}
          />

          <div className="space-y-16">
            {education.map((item, idx) => (
              <div key={item.institution} className="relative group">
                {/* Timeline Node that transitions from cyan to ember */}
                <div
                  aria-hidden="true"
                  className="absolute -left-[29px] sm:-left-[45px] top-1.5 w-3 h-3 rounded-full bg-surface border-2 border-accent group-hover:border-warm transition-colors shadow-[0_0_10px_rgba(56,242,230,0.5)]"
                />

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                    <span className="text-warm font-semibold tracking-wider">
                      {item.period}
                    </span>
                    {item.cgpa && (
                      <span className="px-2 py-0.5 rounded-xs bg-accent/10 border border-accent/30 text-accent font-medium">
                        CGPA: {item.cgpa}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-text-dim ml-auto">
                      <MapPin className="w-3 h-3 text-accent" />
                      {item.location}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-text font-normal">
                      {item.institution}
                    </h3>
                    <p className="font-sans text-base sm:text-lg text-text-secondary mt-1">
                      {item.degree} — <span className="text-text">{item.field}</span>
                    </p>
                  </div>

                  {item.highlights && item.highlights.length > 0 && (
                    <ul className="pt-3 space-y-2 max-w-2xl">
                      {item.highlights.map((h, hIdx) => (
                        <li
                          key={hIdx}
                          className="text-sm text-text-secondary leading-relaxed flex items-start gap-2.5"
                        >
                          <span className="font-mono text-xs text-accent mt-0.5">&bull;</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
