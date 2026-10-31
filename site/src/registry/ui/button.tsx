import type { VariantProps } from "class-variance-authority";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import { cn } from "cn";

import { Spinner } from "./loading";

export const buttonVariants = cva(
  cn(
    "group relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap border font-medium text-sm outline-none transition-all",
    "pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
    "focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-1 focus-visible:ring-offset-background",
    "data-disabled:pointer-events-none data-loading:select-none data-loading:text-transparent data-disabled:opacity-50",
    "[&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0"
  ),
  {
    defaultVariants: {
      shape: "default",
      size: "default",
      variant: "default",
    },
    variants: {
      shape: {
        default: "rounded-lg",
        full: "rounded-full",
        none: "rounded-none",
      },
      size: {
        default: "h-8 px-[calc(--spacing(3)-1px)]",
        icon: "size-8",
        "icon-lg": "size-9",
        "icon-sm": "size-7",
        "icon-xl": "size-10 [&_svg:not([class*='size-'])]:size-4.5",
        "icon-xs":
          "size-6 rounded-md not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 px-[calc(--spacing(3.5)-1px)]",
        sm: "h-7 gap-1.5 px-[calc(--spacing(2.5)-1px)]",
        xl: "h-10 px-[calc(--spacing(4)-1px)] text-base [&_svg:not([class*='size-'])]:size-4.5",
        xs: "h-6 gap-1 rounded-md px-[calc(--spacing(2)-1px)] text-xs [&_svg:not([class*='size-'])]:size-3.5",
      },
      variant: {
        "animated-link":
          "border-transparent after:absolute after:bottom-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-foreground after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100",
        default:
          "border-foreground bg-foreground text-background hover:bg-foreground/80 data-pressed:bg-foreground/80 *:data-[slot=button-loading-indicator]:text-background",
        destructive:
          "border-destructive bg-destructive text-white hover:bg-[color-mix(in_oklab,var(--color-destructive)_90%,var(--color-foreground)_10%)] data-pressed:bg-[color-mix(in_oklab,var(--color-destructive)_90%,var(--color-foreground)_10%)] *:data-[slot=button-loading-indicator]:text-white",
        ghost: "border-transparent hover:bg-accent data-pressed:bg-accent",
        link: "border-transparent text-foreground underline-offset-4 hover:underline",
        outline:
          "bg-background bg-clip-padding hover:bg-accent data-pressed:bg-accent",
        secondary: "bg-background-muted hover:bg-accent data-pressed:bg-accent",
        unstyled: "",
      },
    },
  }
);

export type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  shape,
  size,
  children,
  loading = false,
  disabled,
  focusableWhenDisabled,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ shape, size, variant }), className)}
      data-slot="button"
      {...props}
      data-loading={loading ? "" : undefined}
      disabled={Boolean(loading || disabled)}
      focusableWhenDisabled={focusableWhenDisabled ?? loading}
    >
      {children}
      {loading ? (
        <Spinner
          className="pointer-events-none absolute"
          data-slot="button-loading-indicator"
        />
      ) : null}
    </ButtonPrimitive>
  );
}
