import { cn } from "cn";

export function ColorThumb({
  className,
  dragging = false,
  style,
}: {
  className?: string;
  dragging?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.45)] transition-[scale] duration-100 ease-out motion-reduce:transition-none",
        dragging && "scale-115",
        className
      )}
      style={style}
    />
  );
}
