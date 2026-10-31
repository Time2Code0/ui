"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "cn";

export function Checkbox({
  className,
  ...props
}: CheckboxPrimitive.Root.Props): React.ReactElement {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "relative inline-flex size-4 shrink-0 items-center justify-center rounded-sm border bg-background outline-none ring-foreground/30 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        "aria-invalid:border-destructive/30 focus-visible:aria-invalid:border-destructive/60 focus-visible:aria-invalid:ring-destructive-subtel",
        className
      )}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="absolute -inset-px flex items-center justify-center rounded-sm text-background data-unchecked:hidden data-checked:bg-foreground data-indeterminate:text-foreground"
        data-slot="checkbox-indicator"
        render={(
          indicatorProps: React.ComponentProps<"span">,
          state: CheckboxPrimitive.Indicator.State
        ) => (
          <span {...indicatorProps}>
            {state.indeterminate ? (
              <svg
                aria-hidden="true"
                className="size-3.5 sm:size-3"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.252 12h13.496" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                className="size-3.5 sm:size-3"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
              </svg>
            )}
          </span>
        )}
      />
    </CheckboxPrimitive.Root>
  );
}
