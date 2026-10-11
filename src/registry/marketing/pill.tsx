import { cn } from "cn";

export function Pill({
  children,
  className,
  containerClassName,
  animate = false,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative inline-block rounded-full p-px",
        containerClassName
      )}
    >
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-linear-to-r from-primary to-secondary [background-size:100%]",
          animate &&
            "animate-pill-gradient-background from-primary via-secondary to-primary [background-size:300%_100%]"
        )}
      />

      <div
        className={cn(
          "relative rounded-full bg-background px-4 py-0.5",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
