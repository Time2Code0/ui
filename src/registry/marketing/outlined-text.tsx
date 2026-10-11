import { cn } from "cn";

interface Props extends React.ComponentPropsWithoutRef<"span"> {
  strokeWidth?: number;
}

export function OutlinedText({ className, strokeWidth = 1, ...props }: Props) {
  return (
    <span
      className={cn(
        "text-transparent [-webkit-text-stroke-color:var(--foreground)]",
        className
      )}
      style={{ WebkitTextStrokeWidth: `${strokeWidth}px` }}
      {...props}
    />
  );
}
