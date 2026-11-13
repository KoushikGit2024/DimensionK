import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className = "",
  hoverEffect = true,
  children,
  ...props
}) => {
  return (
    <div
      className={`relative bg-surface/90 border border-border p-6 rounded-sm transition-all duration-300 ${
        hoverEffect
          ? "hover:border-border-strong hover:bg-surface-raised/90 hover:shadow-lg hover:shadow-void/50"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

