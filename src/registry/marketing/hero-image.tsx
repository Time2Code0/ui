"use client";

import type { ImageProps } from "next/image";

import { cn } from "cn";

import { BlurImage } from "../ui/blur-image";

interface Props extends ImageProps {
  children?: React.ReactNode;
  className?: string;
}

export function HeroImage({ children, className, ...props }: Props) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-foreground/[.04] bg-foreground/[.02] p-2 backdrop-blur-xs",
        className
      )}
    >
      <div className="absolute -inset-px rounded-2xl border bg-foreground/[.02]" />

      {children}

      <div className="relative overflow-hidden rounded-lg">
        <BlurImage {...props} />
      </div>
    </div>
  );
}
