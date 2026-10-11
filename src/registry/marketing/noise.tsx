import { cn } from "cn";

interface Props extends React.HTMLProps<SVGSVGElement> {
  animate?: boolean;
  blendMode?: "soft-light" | "overlay";
  grainSize?: number;
  invert?: boolean;
  opacity?: number;
}

export function Noise({
  invert = false,
  blendMode = "soft-light",
  opacity = 1,
  grainSize = 1.2,
  animate = false,
  className,
  style,
  ...props
}: Props) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        invert && "invert",
        className
      )}
      height="100%"
      style={{
        mixBlendMode: blendMode,
        opacity,
        ...style,
      }}
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>noise filter</title>
      <filter id="noise">
        <feTurbulence
          baseFrequency={1 / grainSize}
          numOctaves={3}
          seed={0}
          stitchTiles="stitch"
          type="fractalNoise"
        >
          {animate ? (
            <animate
              attributeName="seed"
              dur="1.5s"
              from="0"
              repeatCount="indefinite"
              to="100"
            />
          ) : null}
        </feTurbulence>
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0
                    1 0 0 0 0
                    1 0 0 0 0
                    0 0 0 1 0"
        />
        <feComponentTransfer>
          <feFuncR tableValues="0 1" type="table" />
          <feFuncG tableValues="0 1" type="table" />
          <feFuncB tableValues="0 1" type="table" />
        </feComponentTransfer>
      </filter>
      <rect filter="url(#noise)" height="100%" width="100%" />
    </svg>
  );
}
