"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface SectionHeadingProps {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  rightMeta?: React.ReactNode;
  className?: string;
}

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];
const EASE = [0.16, 1, 0.3, 1] as const;

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  eyebrow,
  title,
  description,
  rightMeta,
  className = "",
}) => {
  const reduce = useReducedMotion();
  const words = title.split(" ");
  const chapter = index ? ROMAN[Number(index)] ?? index : undefined;

  return (
    <>
      <div
        className={`flex flex-col lg:flex-row lg:items-end justify-between gap-8 ${className}`}
      >
        <div className="max-w-3xl space-y-5">
          <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
            {chapter && (
              <span className="font-display text-3xl italic normal-case tracking-normal text-warm">
                {chapter}.
              </span>
            )}
            {eyebrow && <span>{eyebrow}</span>}
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.04] tracking-tight text-text">
            {words.map((w, i) => (
              <React.Fragment key={i}>
                <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
                  <motion.span
                    className="inline-block"
                    initial={reduce ? false : { y: "110%" }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
                  >
                    {w}
                  </motion.span>
                </span>
                {i < words.length - 1 && " "}
              </React.Fragment>
            ))}
          </h2>

          {description && (
            <p className="max-w-2xl text-sm sm:text-base text-text-secondary leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {rightMeta && <div className="shrink-0">{rightMeta}</div>}
      </div>

      <motion.div
        aria-hidden="true"
        className="mt-8 mb-12 lg:mb-16 h-px origin-left bg-white/10"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE }}
      />
    </>
  );
};
