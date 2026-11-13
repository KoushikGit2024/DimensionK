import React from "react";

interface TelemetryStampProps {
  label: string;
  value: string;
  variant?: "cyan" | "warm";
  className?: string;
}

export const TelemetryStamp: React.FC<TelemetryStampProps> = ({
  label,
  value,
  variant = "cyan",
  className = "",
}) => {
  const isWarm = variant === "warm";

  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-xs border rounded-xs px-2.5 py-1 transition-all ${
        isWarm
          ? "border-warm/30 bg-warm/[0.04] shadow-[0_0_12px_rgba(240,163,94,0.08)]"
          : "border-accent/30 bg-accent/[0.04] shadow-[0_0_12px_rgba(56,242,230,0.08)]"
      } ${className}`}
    >
      <span className="text-text-muted uppercase tracking-wider">{label}</span>
      <span className={isWarm ? "text-warm/60" : "text-accent/60"}>::</span>
      <span className={`font-medium ${isWarm ? "text-warm" : "text-accent"}`}>{value}</span>
    </div>
  );
};
