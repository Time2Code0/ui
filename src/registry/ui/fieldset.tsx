"use client";

import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import { cn } from "cn";

import { Separator } from "./separator";

export function Fieldset(
  props: FieldsetPrimitive.Root.Props
): React.ReactElement {
  return <FieldsetPrimitive.Root data-slot="fieldset" {...props} />;
}
export function FieldsetLegend({
  className,
  ...props
}: FieldsetPrimitive.Legend.Props): React.ReactElement {
  return (
    <FieldsetPrimitive.Legend
      className={cn("font-semibold text-foreground", className)}
      data-slot="fieldset-legend"
      {...props}
    />
  );
}

export function FieldsetSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn("relative -my-2 h-5 text-sm", className)}
      data-content={!!children}
      data-slot="fieldset-separator"
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children ? (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-foreground-muted"
          data-slot="fieldset-separator-content"
        >
          {children}
        </span>
      ) : null}
    </div>
  );
}
