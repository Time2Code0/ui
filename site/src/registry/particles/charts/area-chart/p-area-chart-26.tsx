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
import { AreaChart } from "@/registry/charts/area-chart/area-chart";
import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import {
  SegmentBackground,
  SegmentLineFrom,
  SegmentLineTo,
} from "@/registry/charts/chart-segment/segment";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
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

const areaHeroData = Array.from({ length: 30 }, (_, i) => ({
  costs: Math.floor(5000 + Math.cos(i / 4) * 2000 + ((i * 7) % 1500)),
  date: new Date(2024, 0, i + 1),
  revenue: Math.floor(8000 + Math.sin(i / 5) * 4000 + ((i * 11) % 2000)),
}));

export function Particle() {
  const [curveId, setCurveId] = useState("monotoneX");
  const curve = useMemo(() => {
    const hit = HERO_CURVE_OPTIONS.find((o) => o.value === curveId);
    return hit?.curve ?? curveMonotoneX;
  }, [curveId]);

  return (
    <div className="space-y-3">
      <ChartHeroCurveToolbar onValueChange={setCurveId} value={curveId} />
      <AreaChart
        aspectRatio="4 / 1"
        data={areaHeroData}
        margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
      >
        <Grid horizontal />
        <Area
          curve={curve}
          dataKey="revenue"
          fill="var(--color-chart-1)"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Area
          curve={curve}
          dataKey="costs"
          fill="var(--color-chart-2)"
          fillOpacity={0.2}
          strokeWidth={1.5}
        />
        <SegmentBackground />
        <SegmentLineFrom />
        <SegmentLineTo />
        <XAxis />
        <ChartTooltip />
      </AreaChart>
    </div>
  );
}
