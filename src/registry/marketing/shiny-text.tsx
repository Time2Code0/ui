import { cn } from "cn";

interface Props extends React.ComponentPropsWithoutRef<"span"> {
  duration?: number;
  onlyOnHover?: boolean;
  shimmerWidth?: number;
}

export function ShinyText({
  children,
  className,
  shimmerWidth = 100,
  duration = 5,
  onlyOnHover = false,
  ...props
}: Props) {
  return (
    <span
      className={cn(
        "bg-linear-to-r from-transparent via-foreground to-transparent bg-clip-text bg-no-repeat text-foreground/50 [background-position:0_0] [background-size:var(--shimmer-width)_100%]",
        onlyOnHover
          ? "[background-position:calc(-100%_-_var(--shimmer-width))_0] hover:transition-[background-position] hover:[background-position:calc(100%_+_var(--shimmer-width))_0] hover:[transition-duration:var(--duration)]"
          : "animate-shiny-text",
        className
      )}
      style={
        {
          "--duration": `${duration}s`,
          "--shimmer-width": `${shimmerWidth}px`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </span>
  );
}
