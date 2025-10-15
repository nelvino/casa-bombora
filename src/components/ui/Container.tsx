"use client";

import { cn } from "@/lib/utils/cn";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "default" | "small" | "large";
}

export function Container({
  children,
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 md:px-8",
        {
          "max-w-6xl": size === "default",
          "max-w-4xl": size === "small",
          "max-w-7xl": size === "large",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
