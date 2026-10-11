"use client";

import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import { cn } from "cn";

import { Separator } from "./separator";

export function OTPField({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof OTPFieldPrimitive.Root> & {
  size?: "default" | "lg";
}): React.ReactElement {
  return (
    <OTPFieldPrimitive.Root
      className={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        className
      )}
      data-size={size}
      data-slot="otp-field"
      {...props}
    />
  );
}

export function OTPFieldInput({
  className,
  ...props
}: React.ComponentProps<typeof OTPFieldPrimitive.Input>): React.ReactElement {
  return (
    <OTPFieldPrimitive.Input
      className={cn(
        "relative size-8 min-w-0 rounded-lg border bg-background text-center text-foreground text-sm leading-8 outline-none ring-foreground/30",
        "in-[[data-slot=otp-field][data-size=lg]]:size-9 in-[[data-slot=otp-field][data-size=lg]]:text-base in-[[data-slot=otp-field][data-size=lg]]:leading-9",
        "focus-visible:z-10 focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-foreground/30 aria-invalid:border-destructive/30 aria-invalid:focus-visible:border-destructive/60 aria-invalid:focus-visible:ring-destructive-subtel",
        className
      )}
      data-slot="otp-field-input"
      spellCheck={false}
      {...props}
    />
  );
}

export function OTPFieldSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>): React.ReactElement {
  return (
    <OTPFieldPrimitive.Separator
      render={
        <Separator
          className={cn(
            "rounded-full data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:w-3",
            className
          )}
          orientation="horizontal"
          {...props}
        />
      }
    />
  );
}
