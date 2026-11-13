import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "telemetry";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-sm gap-1.5",
      md: "px-4 py-2 text-sm rounded-sm gap-2",
      lg: "px-6 py-3 text-base rounded-sm gap-2.5",
    };

    const variants = {
      primary:
        "bg-surface-raised border border-border-strong text-text hover:bg-surface-muted hover:border-accent hover:text-white active:scale-[0.98]",
      secondary:
        "bg-transparent border border-border text-text-secondary hover:text-text hover:border-border-strong active:scale-[0.98]",
      ghost:
        "bg-transparent text-text-secondary hover:text-text hover:bg-surface active:scale-[0.98]",
      telemetry:
        "font-mono text-xs uppercase tracking-widest bg-void/80 border border-border-subtle text-accent hover:border-accent hover:text-accent-strong px-3 py-1.5",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

