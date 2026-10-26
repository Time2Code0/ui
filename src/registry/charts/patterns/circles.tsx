import { cn } from "cn";

import { Pattern } from "./pattern";

export interface PatternCirclesProps {
  /** Background color applied behind circles. */
  background?: string;
  /** className applied to circles. */
  className?: string;
  /** Whether to fill in circles within the pattern gaps to increase pattern density. */
  complement?: boolean;
  /** Fill applied to circles. */
  fill?: string;
  /** Height of the pattern element. */
  height: number;
  /** Unique id for the pattern. */
  id: string;
  /** Radius of the pattern circles. */
  radius?: number;
  /** stroke applied to circles. */
  stroke?: string;
  /** strokeDasharray applied to circles. */
  strokeDasharray?: number | string;
  /** strokeWidth applied to circles. */
  strokeWidth?: number | string;
  /** Width of the pattern element. */
  width: number;
}

export function Circles({
  id,
  width,
  height,
  radius = 2,
  fill,
  stroke,
  strokeWidth,
  strokeDasharray,
  background,
  complement = false,
  className,
}: PatternCirclesProps) {
  let corners: [number, number][] | undefined;
  if (complement) {
    corners = [
      [0, 0],
      [0, height],
      [width, 0],
      [width, height],
    ];
  }
  return (
    <Pattern height={height} id={id} width={width}>
      {!!background && <rect fill={background} height={height} width={width} />}
      <circle
        className={cn("visx-pattern-circle", className)}
        cx={width / 2}
        cy={height / 2}
        fill={fill}
        r={radius}
        stroke={stroke}
        strokeDasharray={strokeDasharray}
        strokeWidth={strokeWidth}
      />
      {corners?.map(([cornerX, cornerY]) => (
        <circle
          className={cn(
            "visx-pattern-circle visx-pattern-circle-complement",
            className
          )}
          cx={cornerX}
          cy={cornerY}
          fill={fill}
          key={`${id}-complement-${cornerX}-${cornerY}`}
          r={radius}
          stroke={stroke}
          strokeDasharray={strokeDasharray}
          strokeWidth={strokeWidth}
        />
      ))}
    </Pattern>
  );
}
