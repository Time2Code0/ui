import { cn } from "cn";

import { Path } from "./path";

export interface PatternWavesProps {
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

export function Waves({
  id,
  width,
  height,
  fill,
  stroke,
  strokeWidth,
  strokeDasharray,
  strokeLinecap,
  shapeRendering,
  background,
  className,
}: PatternWavesProps) {
  return (
    <Path
      background={background}
      className={cn("visx-pattern-wave", className)}
      fill={fill}
      height={height}
      id={id}
      path={`M 0 ${height / 2} c ${height / 8} ${-height / 4} , ${(height * 3) / 8} ${-height / 4} , ${height / 2} 0
             c ${height / 8} ${height / 4} , ${(height * 3) / 8} ${height / 4} , ${height / 2} 0 M ${-height / 2} ${height / 2}
             c ${height / 8} ${height / 4} , ${(height * 3) / 8} ${height / 4} , ${height / 2} 0 M ${height} ${height / 2}
             c ${height / 8} ${-height / 4} , ${(height * 3) / 8} ${-height / 4} , ${height / 2} 0`}
      shapeRendering={shapeRendering}
      stroke={stroke}
      strokeDasharray={strokeDasharray}
      strokeLinecap={strokeLinecap}
      strokeWidth={strokeWidth}
      width={width}
    />
  );
}
