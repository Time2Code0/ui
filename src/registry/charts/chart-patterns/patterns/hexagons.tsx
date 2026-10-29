import { cn } from "cn";

import { Path } from "./path";

export interface PatternHexagonsProps {
  /** Background color applied behind hexagons. */
  background?: string;
  /** className applied to hexagon path element. */
  className?: string;
  /** Fill applied to hexagons. */
  fill?: string;
  /** Height of the pattern element. */
  height: number;
  /** Unique id for the pattern. */
  id: string;
  /** shapeRendering applied to hexagon paths. */
  shapeRendering?: string | number;
  /** Size of the hexagon shape. */
  size?: number;
  /** Stroke color applied to hexagon paths. */
  stroke?: string;
  /** strokeDasharray applied to hexagon paths. */
  strokeDasharray?: string | number;
  /** strokeLinecap applied to hexagon paths. */
  strokeLinecap?: "square" | "butt" | "round" | "inherit";
  /** strokeWidth applied to hexagon paths. */
  strokeWidth?: number | string;
}

export function Hexagons({
  id,
  height,
  fill,
  stroke,
  strokeWidth,
  strokeDasharray,
  strokeLinecap,
  shapeRendering,
  background,
  className,
  size = 3,
}: PatternHexagonsProps) {
  const sqrtSize = Math.sqrt(size);
  return (
    <Path
      background={background}
      className={cn("visx-pattern-hexagon", className)}
      fill={fill}
      height={sqrtSize}
      id={id}
      path={`M ${height},0 l ${height},0 l ${height / 2},${(height * sqrtSize) / 2} l ${-height / 2},${(height * sqrtSize) / 2} l ${-height},0 l ${-height / 2},${(-height * sqrtSize) / 2} Z M 0,${(height * sqrtSize) / 2} l ${height / 2},0 M ${3 * height},${(height * sqrtSize) / 2} l ${-height / 2},0`}
      shapeRendering={shapeRendering}
      stroke={stroke}
      strokeDasharray={strokeDasharray}
      strokeLinecap={strokeLinecap}
      strokeWidth={strokeWidth}
      width={size}
    />
  );
}
