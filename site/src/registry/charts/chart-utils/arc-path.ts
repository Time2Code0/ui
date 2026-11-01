import { arc } from "d3-shape";

interface ArcDatum {
  cornerRadius: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  padAngle: number;
  startAngle: number;
}

// One shared generator whose accessors read the datum, so per-frame calls
// (enter animations, hover grow) don't build a new generator each time.
const generator = arc<ArcDatum>()
  .innerRadius((d) => d.innerRadius)
  .outerRadius((d) => d.outerRadius)
  .startAngle((d) => d.startAngle)
  .endAngle((d) => d.endAngle)
  .cornerRadius((d) => d.cornerRadius)
  .padAngle((d) => d.padAngle);

/**
 * SVG `d` of an annular sector centred on the origin (radians, 0 at 12
 * o'clock, clockwise). `""` when there is nothing to draw.
 */
export function arcPath(
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
  cornerRadius = 0,
  padAngle = 0
): string {
  return (
    generator({
      cornerRadius,
      endAngle,
      innerRadius,
      outerRadius,
      padAngle,
      startAngle,
    }) ?? ""
  );
}
