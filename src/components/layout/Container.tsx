import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide";
}

export const Container: React.FC<ContainerProps> = ({
  size = "default",
  className = "",
  children,
  ...props
}) => {
  const maxSizes = {
    narrow: "max-w-4xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  };

  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxSizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

