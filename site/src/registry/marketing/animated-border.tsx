"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";

interface BorderBeamProps extends useRender.ComponentProps<"div"> {
  anchor?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  containerClassName?: string;
  delay?: number;
  duration?: number;
  size?: number;
}

export function Beam({
  children,
  className,
  containerClassName,
  size = 300,
  duration = 15,
  anchor = 90,
  borderWidth = 1,
  delay = 0,
  colorFrom = "var(--color-primary)",
  colorTo = "var(--color-secondary)",
  render,
  ...props
}: BorderBeamProps): React.ReactElement {
  const defaultProps = {
    children: (
      <>
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] [border:var(--border-width)_solid_transparent] [mask-clip:padding-box,border-box]! [mask-composite:intersect]! [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
            "after:absolute after:aspect-square after:size-(--size) after:animate-border-beam after:[animation-delay:var(--delay)] after:[background-image:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_var(--size))]",
            className
          )}
        />
        {children}
      </>
    ),
    className: cn("relative", containerClassName),
    style: {
      "--anchor": anchor,
      "--border-width": `${borderWidth}px`,
      "--color-from": colorFrom,
      "--color-to": colorTo,
      "--delay": `${delay}s`,
      "--duration": `${duration}s`,
      "--size": `${size}px`,
    } as React.CSSProperties,
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

interface ShinyBorderProps extends useRender.ComponentProps<"div"> {
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  duration?: number;
}

export function Shiny({
  children,
  className,
  duration = 14,
  borderWidth = 1,
  colorFrom = "var(--color-primary)",
  colorTo = "var(--color-secondary)",
  render,
  ...props
}: ShinyBorderProps): React.ReactElement {
  const defaultProps = {
    children,
    className: cn(
      "relative",
      "before:pointer-events-none before:absolute before:inset-0 before:aspect-square before:size-full before:animate-border-shiny before:rounded-[inherit] before:p-(--border-width) before:will-change-[background-position] before:[-webkit-mask-composite:xor]! before:[background-image:radial-gradient(transparent,transparent,var(--color-from),var(--color-to),transparent,transparent)] before:[background-size:300%_300%] before:[mask-composite:exclude]! before:[mask:linear-gradient(#fff_0_0)_content-box,_linear-gradient(#fff_0_0)]",
      className
    ),
    style: {
      "--border-width": `${borderWidth}px`,
      "--color-from": colorFrom,
      "--color-to": colorTo,
      "--duration": `${duration}s`,
    } as React.CSSProperties,
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

interface FullBolderProps extends useRender.ComponentProps<"div"> {
  borderWidth?: number;
  duration?: number;
}

export function Full({
  children,
  className,
  duration = 8,
  borderWidth = 1,
  render,
  ...props
}: FullBolderProps): React.ReactElement {
  const defaultProps = {
    children,
    className: cn(
      "relative",
      "before:pointer-events-none before:absolute before:inset-0 before:animate-border-full before:border-[inherit] before:bg-linear-to-r before:from-primary before:via-secondary before:to-primary before:p-(--border-width) before:will-change-[background-position] before:[-webkit-mask-composite:xor]! before:[background-size:300%_100%] before:[mask-composite:exclude]! before:[mask:linear-gradient(#fff_0_0)_content-box,_linear-gradient(#fff_0_0)]",
      className
    ),
    style: {
      "--border-width": `${borderWidth}px`,
      "--duration": `${duration}s`,
    } as React.CSSProperties,
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}
