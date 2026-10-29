"use client";

import type { ComponentProps } from "react";

import { Circles as VisxPatternCircles } from "./patterns/circles";
import { Hexagons as VisxPatternHexagons } from "./patterns/hexagons";
import { Lines as VisxPatternLines } from "./patterns/lines";
import { Waves as VisxPatternWaves } from "./patterns/waves";

export function PatternLines(props: ComponentProps<typeof VisxPatternLines>) {
  return <VisxPatternLines {...props} />;
}
PatternLines.displayName = "PatternLines";

export function PatternCircles(
  props: ComponentProps<typeof VisxPatternCircles>
) {
  return <VisxPatternCircles {...props} />;
}
PatternCircles.displayName = "PatternCircles";

export function PatternWaves(props: ComponentProps<typeof VisxPatternWaves>) {
  return <VisxPatternWaves {...props} />;
}
PatternWaves.displayName = "PatternWaves";

export function PatternHexagons(
  props: ComponentProps<typeof VisxPatternHexagons>
) {
  return <VisxPatternHexagons {...props} />;
}
PatternHexagons.displayName = "PatternHexagons";
