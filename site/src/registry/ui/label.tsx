"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";

export function Label({
  className,
  render,
  ...props
}: useRender.ComponentProps<"label">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "inline-flex items-center gap-2 font-medium text-foreground text-sm/4",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      "after:hidden after:text-destructive after:content-['*'] aria-required:after:inline-block",
      className
    ),
    "data-slot": "label",
  };

  return useRender({
    defaultTagName: "label",
    props: mergeProps<"label">(defaultProps, props),
    render,
  });
}
