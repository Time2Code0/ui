import { cn } from "cn";

interface Props {
  children: React.ReactNode;
  className?: string;
  pauseOnHover?: boolean;
  repeat?: number;
  reverse?: boolean;
  vertical?: boolean;
}

export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 2,
}: Props) {
  return (
    <div
      className={cn(
        "group flex gap-[var(--gap)] overflow-hidden p-2 [--duration:20s] [--gap:1rem]",
        vertical ? "flex-col" : "flex-row",
        className
      )}
    >
      {new Array(repeat).fill(crypto.randomUUID()).map((key) => (
        <div
          className={cn(
            "flex shrink-0 justify-around gap-[var(--gap)]",
            vertical
              ? "animate-marquee-vertical flex-col"
              : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]"
          )}
          key={key}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
