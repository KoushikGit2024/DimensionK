import React from "react";

interface SectionHeadingProps {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  eyebrow,
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`mb-10 lg:mb-14 space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        {index && (
          <span className="font-mono text-xs text-accent tracking-widest uppercase">
            {index}
          </span>
        )}
        {index && eyebrow && (
          <span className="text-border-strong select-none">/</span>
        )}
        {eyebrow && (
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
            {eyebrow}
          </span>
        )}
      </div>

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-text">
        {title}
      </h2>

      {description && (
        <p className="max-w-2xl text-sm sm:text-base text-text-secondary leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

