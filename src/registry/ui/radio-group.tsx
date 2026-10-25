/** biome-ignore-all lint/style/noExportedImports: re-exported for custom compositions */
"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cn } from "cn";

export function RadioGroup({
  className,
  ...props
}: RadioGroupPrimitive.Props): React.ReactElement {
  return (
    <RadioGroupPrimitive
      className={cn("flex flex-col gap-3", className)}
      data-slot="radio-group"
      {...props}
    />
  );
}

export function Radio({
  className,
  ...props
}: RadioPrimitive.Root.Props): React.ReactElement {
  return (
    <RadioPrimitive.Root
      className={cn(
        "relative inline-flex size-4 shrink-0 items-center justify-center rounded-full border bg-background outline-none",
        "focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-1 focus-visible:ring-offset-background aria-invalid:border-destructive/30 focus-visible:aria-invalid:border-destructive/60 focus-visible:aria-invalid:ring-destructive-subtel",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      data-slot="radio"
      {...props}
    >
      <RadioPrimitive.Indicator
        className="absolute -inset-px flex size-4 items-center justify-center rounded-full before:size-1.5 before:rounded-full before:bg-background data-unchecked:hidden data-checked:bg-foreground"
        data-slot="radio-indicator"
      />
    </RadioPrimitive.Root>
  );
}

export { RadioGroupPrimitive, RadioPrimitive };
