import { cn } from "cn";

interface Props {
  children?: React.ReactNode;
  colorLeft?: string;
  colorRight?: string;
  duration?: number;
  gradient?: boolean;
}

export function RetroGrid({
  children,
  duration = 30,
  gradient = false,
  colorLeft = "var(--primary)",
  colorRight = "var(--secondary)",
}: Props) {
  return (
    <div
      className="absolute inset-0 overflow-hidden [perspective:1000px]"
      style={
        {
          "--duration": `${duration}s`,
          "--left": colorLeft,
          "--right": colorRight,
        } as React.CSSProperties
      }
    >
      {children}

      <div className="absolute inset-0 [transform:rotateX(75deg)]">
        <div
          className={cn(
            "absolute inset-x-0 -inset-y-1/2 ml-[-50%] w-[200vw] animate-retro-grid [-webkit-mask-image:linear-gradient(90deg,#000_2px,transparent_0),linear-gradient(180deg,#000_2px,transparent_0)] [-webkit-mask-position:50%_0] [-webkit-mask-size:80px_80px] [background-position-y:100%]",
            gradient
              ? "bg-[linear-gradient(to_right,var(--left)_45%,transparent_50%,var(--right)_55%)]"
              : "bg-[linear-gradient(to_right,--alpha(var(--foreground)/0.1)_45%,transparent_50%,--alpha(var(--foreground)/0.1)_55%)]"
          )}
        />
      </div>
    </div>
  );
}
