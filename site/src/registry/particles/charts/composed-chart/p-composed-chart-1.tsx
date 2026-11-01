"use client";

import { useMemo, useState } from "react";

import {
  curveBasis,
  curveCatmullRom,
  curveLinear,
  curveMonotoneX,
  curveNatural,
  curveStep,
} from "d3-shape";

import { Area } from "@/registry/charts/area-chart/area";
import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { ComposedChart } from "@/registry/charts/composed-chart/composed-chart";
import { SeriesBar } from "@/registry/charts/composed-chart/series-bar";
import { Line } from "@/registry/charts/line-chart/line";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select";

/** Smoother path through dense daily points (hero + docs preview revenue / runRate). */
const composedHeroSmoothCurve = curveCatmullRom.alpha(0.42);

const HERO_CURVE_OPTIONS = [
  { curve: curveNatural, label: "Natural", value: "natural" },
  { curve: curveMonotoneX, label: "Monotone X", value: "monotoneX" },
  { curve: curveLinear, label: "Linear", value: "linear" },
  { curve: curveStep, label: "Step", value: "step" },
  { curve: curveBasis, label: "Basis", value: "basis" },
  {
    curve: composedHeroSmoothCurve,
    label: "Catmull–Rom",
    value: "catmullRom",
  },
] as const;

function ChartHeroCurveToolbar({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (v: string) => void;
}) {
  return (
    // Right inset clears the frame's top-right Replay overlay.
    <div className="flex flex-wrap items-center justify-end gap-2 pr-6 sm:pr-4">
      <span className="text-foreground-muted text-xs">Curve</span>
      <Select
        onValueChange={(v) => {
          if (v != null) {
            onValueChange(v);
          }
        }}
        value={value}
      >
        <SelectTrigger
          aria-label="Chart curve"
          className="w-[min(100%,11rem)] text-xs"
          size="sm"
        >
          <SelectValue placeholder="Curve" />
        </SelectTrigger>
        <SelectPopup alignItemWithTrigger={false}>
          {HERO_CURVE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </div>
  );
}

const COMPOSED_DEMO_DAY_COUNT = 30;

/** One slow cycle across the window + light ripples (readable, not “ECG” noise). */
function smoothCycle(i: number, phase: number): number {
  const u = i / (COMPOSED_DEMO_DAY_COUNT - 1);
  return Math.sin(u * Math.PI * 2 + phase);
}

const START_MS = Date.UTC(2024, 0, 1, 12, 0, 0);

/** UTC noon per day so x positions and labels stay stable across time zones. */
const DAY_MS = 86_400_000;

function isoDay(i: number): string {
  return new Date(START_MS + i * DAY_MS).toISOString();
}

/** Daily rows: units (bars), revenue + runRate (line / area) — gentle variation. */
const composedDemoData = Array.from(
  { length: COMPOSED_DEMO_DAY_COUNT },
  (_, i) => {
    const units = Math.round(
      46 +
        14 * smoothCycle(i, 0.35) +
        6 * Math.sin(i / 14) +
        (i / COMPOSED_DEMO_DAY_COUNT) * 10
    );
    const revenue = Math.round(
      96 +
        11 * smoothCycle(i, 1.05) +
        5 * Math.sin(i / 17) +
        (i / COMPOSED_DEMO_DAY_COUNT) * 18
    );
    const runRate = Math.round(
      82 +
        9 * smoothCycle(i, 1.9) +
        5 * Math.cos(i / 16) +
        (i / COMPOSED_DEMO_DAY_COUNT) * 8
    );
    return {
      date: isoDay(i),
      revenue: Math.max(72, Math.min(155, revenue)),
      runRate: Math.max(62, Math.min(118, runRate)),
      units: Math.max(18, Math.min(95, units)),
    };
  }
);

export function Particle() {
  const [curveId, setCurveId] = useState("catmullRom");
  const curve = useMemo(() => {
    const hit = HERO_CURVE_OPTIONS.find((o) => o.value === curveId);
    return hit?.curve ?? composedHeroSmoothCurve;
  }, [curveId]);

  return (
    <div className="space-y-3">
      <ChartHeroCurveToolbar onValueChange={setCurveId} value={curveId} />
      <ComposedChart
        aspectRatio="2 / 1"
        barGap={0}
        data={composedDemoData as unknown as Record<string, unknown>[]}
        margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
        maxBarSize={32}
        xDataKey="date"
      >
        <Grid horizontal />
        <Area
          curve={curve}
          dataKey="runRate"
          fill="var(--color-chart-4)"
          fillOpacity={0.32}
        />
        <SeriesBar dataKey="units" fill="var(--color-chart-3)" radius={4} />
        <Line
          curve={curve}
          dataKey="revenue"
          stroke="var(--color-chart-1)"
          strokeWidth={2.5}
        />
        <ChartTooltip showCrosshair={false} />
        <XAxis numTicks={8} />
      </ComposedChart>
    </div>
  );
}
