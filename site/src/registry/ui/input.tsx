"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";

export type InputProps = Omit<
  InputPrimitive.Props & React.RefAttributes<HTMLInputElement>,
  "size"
> & {
  size?: "sm" | "default" | "lg" | number;
  unstyled?: boolean;
  nativeInput?: boolean;
};

export function Input({
  className,
  size = "default",
  unstyled = false,
  nativeInput = false,
  style,
  ...props
}: InputProps): React.ReactElement {
  const inputClassName = cn(
    "h-7.5 w-full min-w-0 rounded-[inherit] px-[calc(--spacing(3)-1px)] text-sm leading-7.5 outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-foreground-muted/70",
    size === "sm" && "h-6.5 px-[calc(--spacing(2.5)-1px)] leading-6.5",
    size === "lg" && "h-8.5 leading-8.5",
    props.type === "search" &&
      "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
    props.type === "file" &&
      "text-foreground-muted file:me-3 file:bg-transparent file:font-medium file:text-foreground"
  );

  return (
    <span
      className={
        cn(
          !unstyled &&
            cn(
              "relative inline-flex w-full rounded-lg border bg-background text-foreground text-sm ring-foreground/30 has-disabled:opacity-50",
              "has-focus-visible:border-foreground has-autofill:bg-foreground/5 has-focus-visible:ring-[3px]",
              "has-focus-visible:has-aria-invalid:border-destructive/60 has-focus-visible:has-aria-invalid:ring-destructive-subtel has-aria-invalid:border-destructive/30"
            ),
          className
        ) || undefined
      }
      data-size={size}
      data-slot="input-control"
    >
      {nativeInput ? (
        <input
          className={inputClassName}
          data-slot="input"
          size={typeof size === "number" ? size : undefined}
          style={typeof style === "function" ? undefined : style}
          {...props}
        />
      ) : (
        <InputPrimitive
          className={inputClassName}
          data-slot="input"
          size={typeof size === "number" ? size : undefined}
          style={style}
          {...props}
        />
      )}
    </span>
  );
}
