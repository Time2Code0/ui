"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

export const badgeVariants = cva(
  cn(
    "relative inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-sm border border-transparent font-medium outline-none transition-shadow disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-1 focus-visible:ring-offset-background",
    "[&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[button&,a&]:cursor-pointer [button&,a&]:pointer-coarse:after:absolute [button&,a&]:pointer-coarse:after:size-full [button&,a&]:pointer-coarse:after:min-h-11 [button&,a&]:pointer-coarse:after:min-w-11"
  ),
  {
    defaultVariants: {
      shape: "default",
      size: "default",
      variant: "default",
    },
    variants: {
      shape: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
      size: {
        default: "h-5.5 min-w-5.5 px-[calc(--spacing(1)-1px)] text-sm",
        lg: "h-6.5 min-w-6.5 px-[calc(--spacing(1.5)-1px)] text-base",
        sm: "h-5 min-w-5 rounded-[.25rem] px-[calc(--spacing(1)-1px)] text-xs",
      },
      variant: {
        default:
          "bg-foreground text-background [button&,a&]:hover:bg-foreground/80",
        destructive:
          "bg-destructive text-white [button&,a&]:hover:text-[color-mix(in_oklab,var(--color-destructive)_90%,var(--color-foreground)_10%)]",
        error:
          "bg-destructive-subtel text-destructive-foreground selection:bg-destructive! selection:text-white!",
        info: "bg-info-subtel text-info-foreground selection:bg-info! selection:text-white!",
        outline:
          "bg-background bg-clip-padding text-foreground [button&,a&]:hover:bg-accent",
        secondary: "bg-background-muted [button&,a&]:hover:bg-accent",
        success:
          "bg-success-subtel text-success-foreground selection:bg-success! selection:text-white!",
        warning:
          "bg-warning-subtel text-warning-foreground selection:bg-warning! selection:text-white!",
      },
    },
  }
);

export interface BadgeProps extends useRender.ComponentProps<"span"> {
  size?: VariantProps<typeof badgeVariants>["size"];
  variant?: VariantProps<typeof badgeVariants>["variant"];
}

export function Badge({
  className,
  variant,
  size,
  render,
  ...props
}: BadgeProps): React.ReactElement {
  const defaultProps = {
    className: cn(badgeVariants({ className, size, variant })),
    "data-slot": "badge",
  };
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}
