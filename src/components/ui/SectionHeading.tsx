import React from "react";

interface SectionHeadingProps {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  rightMeta?: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  eyebrow,
  title,
  description,
  rightMeta,
  className = "",
}) => {
  return (
    <div
      className={`mb-10 lg:mb-14 pb-6 border-b border-white/[0.07] flex flex-col lg:flex-row lg:items-end justify-between gap-6 ${className}`}
    >
      <div className="space-y-3 max-w-3xl">
        <div className="flex items-center gap-2.5">
          {index && (
            <span className="font-mono text-xs text-accent tracking-widest uppercase px-2 py-0.5 bg-accent/[0.08] border border-accent/30 rounded-xs">
              SEC {index}
            </span>
          )}
          {index && eyebrow && (
            <span className="text-border-strong font-mono text-xs select-none">
              //
            </span>
          )}
          {eyebrow && (
            <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
              {eyebrow}
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-text leading-tight">
          {title}
        </h2>

        {description && (
          <p className="max-w-2xl text-sm sm:text-base text-text-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {rightMeta && <div className="shrink-0">{rightMeta}</div>}
    </div>
  );
};
