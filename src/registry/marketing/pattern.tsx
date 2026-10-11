import { useId } from "react";

import { cn } from "cn";

interface SquarePatternProps extends React.ComponentPropsWithoutRef<"svg"> {
  height?: number;
  squares?: [number, number][];
  strokeDasharray?: string;
  width?: number;
  x?: number;
  y?: number;
}

function Square({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  squares = [],
  strokeDasharray = "0",
  className,
  ...props
}: SquarePatternProps) {
  const patternId = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 size-full fill-foreground/5 stroke-foreground/30",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          height={height}
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={width}
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>

      <rect
        fill={`url(#${patternId})`}
        height="100%"
        strokeWidth={0}
        width="100%"
      />

      {squares.length && squares.length > 0 && (
        <svg className="overflow-visible" x={x} y={y}>
          <title>Square Pattern</title>
          {squares.map(([squareX, squareY]) => (
            <rect
              height={height + 1}
              key={`${squareX}-${squareY}`}
              strokeWidth="0"
              width={width + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

interface HexPatternProps extends React.ComponentPropsWithoutRef<"svg"> {
  height?: number;
  width?: number;
  x?: number;
  y?: number;
}

function Hex({
  width = 50,
  height = 43.4,
  x = -1,
  y = -1,
  className,
  ...props
}: HexPatternProps) {
  const patternId = useId();
  const polygonId = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 size-full fill-none stroke-foreground/30",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          height={height}
          id={patternId}
          patternTransform="scale(2)"
          patternUnits="userSpaceOnUse"
          width={width}
          x={x}
          y={y}
        >
          <polygon
            id={polygonId}
            points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2"
            shapeRendering="geometricPrecision"
          />
          <use x={width / 2} xlinkHref={`#${polygonId}`} />
          <use x={(width / 2) * -1} xlinkHref={`#${polygonId}`} />
          <use
            x={width / 4}
            xlinkHref={`#${polygonId}`}
            y={(height / 2) * -1}
          />
          <use
            x={(width / 4) * -1}
            xlinkHref={`#${polygonId}`}
            y={(height / 2) * -1}
          />
        </pattern>
      </defs>

      <rect
        fill={`url(#${patternId})`}
        height="100%"
        strokeWidth={0}
        width="100%"
      />
    </svg>
  );
}

interface DotPatternProps extends React.ComponentPropsWithoutRef<"svg"> {
  circleRadius?: number;
  circleX?: number;
  circleY?: number;
  height?: number;
  width?: number;
  x?: number;
  y?: number;
}

function Dot({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  circleX = 1,
  circleY = 1,
  circleRadius = 1,
  className,
  ...props
}: DotPatternProps) {
  const patternId = useId();

  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 size-full fill-foreground/30",
        className
      )}
      {...props}
    >
      <title>Dot Pattern</title>
      <defs>
        <pattern
          height={height}
          id={patternId}
          patternContentUnits="userSpaceOnUse"
          patternUnits="userSpaceOnUse"
          width={width}
          x={x}
          y={y}
        >
          <circle
            cx={circleX}
            cy={circleY}
            id="pattern-circle"
            r={circleRadius}
          />
        </pattern>
      </defs>

      <rect
        fill={`url(#${patternId})`}
        height="100%"
        strokeWidth="0"
        width="100%"
      />
    </svg>
  );
}

interface LineProps extends React.ComponentPropsWithoutRef<"div"> {
  radius?: number;
}

function Line({ className, style, radius = 315, ...props }: LineProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 size-full",
        "bg-[image:repeating-linear-gradient(315deg,_--alpha(var(--foreground)/0.05)_0,_--alpha(var(--foreground)/0.05)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed",
        className
      )}
      style={{ "--radius": `${radius}deg`, ...style } as React.CSSProperties}
      {...props}
    />
  );
}

export { Dot, Hex, Line, Square };
