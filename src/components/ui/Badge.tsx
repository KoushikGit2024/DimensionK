import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "mono" | "status";
}

export const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "default",
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center px-2 py-0.5 text-xs font-normal transition-colors rounded-sm";

  const variants = {
    default: "bg-surface-raised border border-border text-text-secondary",
    accent: "bg-surface-raised border border-accent/40 text-accent font-medium",
    mono: "font-mono text-[11px] bg-void/90 border border-border-subtle text-text-muted uppercase tracking-wider",
    status: "bg-surface text-accent-strong border border-border-strong font-mono text-[11px]",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

