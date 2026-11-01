import { area, type CurveFactory, line } from "d3-shape";

export interface LinePathOptions<Datum> {
  curve: CurveFactory;
  x: (datum: Datum) => number;
  y: (datum: Datum) => number;
}

export interface AreaPathOptions<Datum> extends LinePathOptions<Datum> {
  /** Baseline in pixels. @default yScale.range()[0] (the bottom of the plot) */
  y0?: number;
  yScale?: { range: () => number[] };
}

/** SVG `d` of a line through `data`; `""` when there is nothing to draw. */
export function linePath<Datum>(
  data: Datum[],
  { curve, x, y }: LinePathOptions<Datum>
): string {
  return line<Datum>().x(x).y(y).curve(curve)(data) ?? "";
}

/**
 * SVG `d` of an area between the line through `data` and a flat baseline
 * (`y0`, or the first value of `yScale.range()`).
 */
export function areaPath<Datum>(
  data: Datum[],
  { curve, x, y, y0, yScale }: AreaPathOptions<Datum>
): string {
  const generator = area<Datum>().x(x).y1(y).curve(curve);
  const baseline = y0 ?? yScale?.range()[0];
  if (baseline !== undefined) {
    generator.y0(baseline);
  }
  return generator(data) ?? "";
}
