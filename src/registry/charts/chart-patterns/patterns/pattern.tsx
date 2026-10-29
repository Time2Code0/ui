import type { ReactNode } from "react";

export interface PatternProps {
  /** Children of pattern element to render. */
  children: ReactNode;
  /** Height of the pattern. */
  height: number;
  /** Unique id of the pattern element. */
  id: string;
  /** Width of the pattern. */
  width: number;
}

export function Pattern({ id, width, height, children }: PatternProps) {
  return (
    <defs>
      <pattern
        height={height}
        id={id}
        patternUnits="userSpaceOnUse"
        width={width}
      >
        {children}
      </pattern>
    </defs>
  );
}
