import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "mono" | "status" | "warm" | "nebula";
}

export const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "default",
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center px-2.5 py-0.5 text-xs font-normal transition-all rounded-sm";

  const variants = {
    default: "bg-surface-raised border border-white/10 text-text-secondary hover:border-white/20",
    accent: "bg-accent/[0.08] border border-accent/40 text-accent font-medium shadow-[0_0_10px_rgba(56,242,230,0.15)]",
    warm: "bg-warm/[0.08] border border-warm/40 text-warm font-medium shadow-[0_0_10px_rgba(240,163,94,0.15)]",
    nebula: "bg-nebula/[0.08] border border-nebula/40 text-purple-300 font-medium shadow-[0_0_10px_rgba(168,85,247,0.15)]",
    mono: "font-mono text-[11px] bg-void/90 border border-border-subtle text-text-muted uppercase tracking-wider",
    status: "bg-accent/10 text-accent border border-accent/30 font-mono text-[11px] shadow-[0_0_8px_rgba(56,242,230,0.15)]",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
