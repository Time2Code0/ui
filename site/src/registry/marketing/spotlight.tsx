"use client";

import { cn } from "cn";
import { motion } from "motion/react";

interface Props extends React.ComponentPropsWithoutRef<typeof motion.span> {
  color?: string;
  containerClassName?: string;
  orientation?: "left" | "right";
}

export function Spotlight({
  color = "209, 205, 125",
  className,
  containerClassName,
  orientation = "left",
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute top-0 left-0 -z-10 size-full",
        containerClassName
      )}
      style={
        {
          "--light-blub-color": color,
        } as React.CSSProperties
      }
    >
      <motion.span
        animate={{ opacity: 1 }}
        className={cn(
          "absolute h-[636px] w-[182px] -translate-y-full overflow-hidden rounded-[38px] blur-xl",
          "shadow-[_rgba(var(--light-blub-color),0.19)_0px_13.4368px_8.0621px_-0.34375px,_rgba(var(--light-blub-color),0.19)_0px_31.8477px_19.1086px_-0.6875px,_rgba(var(--light-blub-color),0.19)_0px_58.0934px_34.8561px_-1.03125px,_rgba(var(--light-blub-color),0.19)_0px_96.5803px_57.9481px_-1.375px,_rgba(var(--light-blub-color),0.18)_0px_155.969px_93.5815px_-1.71875px,_rgba(var(--light-blub-color),0.18)_0px_255.306px_153.184px_-2.0625px,_rgba(var(--light-blub-color),0.17)_0px_439.62px_263.772px_-2.40625px,_rgba(var(--light-blub-color),0.15)_0px_800px_480px_-2.75px]",
          orientation === "left"
            ? "left-0 origin-[75%_75%] -translate-x-full rotate-[315deg]"
            : "right-0 origin-[50%_100%] translate-x-1/2 rotate-45",
          className
        )}
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
        {...props}
      />
    </div>
  );
}
