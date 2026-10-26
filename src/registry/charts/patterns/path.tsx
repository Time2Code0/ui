import { cn } from "cn";

import { Pattern } from "./pattern";

export interface PatternPathProps {
  /** Background color applied behind path. */
  background?: string;
  /** className applied to the path element. */
  className?: string;
  /** fill color applied to path. */
  fill?: string;
  /** Height of the pattern element. */
  height: number;
  /** Unique id for the pattern. */
  id: string;
  /** d attribute of the path element */
  path?: string;
  /** shapeRendering applied to path. */
  shapeRendering?: string | number;
  /** Stroke color applied to path. */
  stroke?: string;
  /** strokeDasharray applied to path. */
  strokeDasharray?: string | number;
  /** strokeLinecap applied to path. */
  strokeLinecap?: "square" | "butt" | "round" | "inherit";
  /** strokeWidth applied to path. */
  strokeWidth?: number | string;
  /** Width of the pattern element. */
  width: number;
}

export function Path({
  id,
  width,
  height,
  path,
  fill = "transparent",
  stroke,
  strokeWidth,
  strokeDasharray,
  strokeLinecap = "square",
  shapeRendering = "auto",
  background,
  className,
}: PatternPathProps) {
  return (
    <Pattern height={height} id={id} width={width}>
      {!!background && <rect fill={background} height={height} width={width} />}
      <path
        className={cn("visx-pattern-path", className)}
        d={path}
        fill={fill}
        shapeRendering={shapeRendering}
        stroke={stroke}
        strokeDasharray={strokeDasharray}
        strokeLinecap={strokeLinecap}
        strokeWidth={strokeWidth}
      />
    </Pattern>
  );
}
