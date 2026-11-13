import React from "react";

interface TelemetryStampProps {
  label: string;
  value: string;
  className?: string;
}

export const TelemetryStamp: React.FC<TelemetryStampProps> = ({
  label,
  value,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-xs border border-border-subtle bg-void/80 px-2.5 py-1 rounded-xs ${className}`}
    >
      <span className="text-text-muted uppercase tracking-wider">{label}</span>
      <span className="text-border-strong">::</span>
      <span className="text-accent font-medium">{value}</span>
    </div>
  );
};

