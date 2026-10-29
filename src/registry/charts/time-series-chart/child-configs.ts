import type { ReactNode } from "react";
import type { BandConfig } from "../chart-core/chart-context";
import type { ProjectionPoint } from "./projection-utils";

import { normalizeYAxisId } from "../chart-core/y-axis-scales";
import {
  getChartChildName,
  walkChartChildren,
} from "../chart-utils/chart-children";
import {
  projectionDateExtents,
  projectionValueExtents,
} from "./projection-utils";

/** Default `<Band>` colour (kept in sync with `Band`'s `fill` default). */
const DEFAULT_BAND_FILL = "var(--color-chart-1)";

interface BandConfigProps {
  fill?: unknown;
  label?: unknown;
  lowerKey?: unknown;
  showInTooltip?: unknown;
  upperKey?: unknown;
  yAxisId?: string | number;
}

/** Default tooltip label: the key for a single-key band, else `lower – upper`. */
export function defaultBandLabel(upperKey: string, lowerKey: string): string {
  return upperKey === lowerKey ? upperKey : `${lowerKey} – ${upperKey}`;
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function bandConfigFromProps(
  props: BandConfigProps | undefined
): BandConfig | null {
  if (!(nonEmptyString(props?.upperKey) && nonEmptyString(props.lowerKey))) {
    return null;
  }
  return {
    color: nonEmptyString(props.fill) ? props.fill : DEFAULT_BAND_FILL,
    label: nonEmptyString(props.label)
      ? props.label
      : defaultBandLabel(props.upperKey, props.lowerKey),
    lowerKey: props.lowerKey,
    showInTooltip: props.showInTooltip !== false,
    upperKey: props.upperKey,
    yAxisId: normalizeYAxisId(props.yAxisId),
  };
}

/** Collect `<Band>` props from chart children so band edges extend the y-domain. */
export function extractBandConfigs(children: ReactNode): BandConfig[] {
  const configs: BandConfig[] = [];
  walkChartChildren(children, (child) => {
    if (getChartChildName(child) !== "Band") {
      return false;
    }
    const config = bandConfigFromProps(
      child.props as BandConfigProps | undefined
    );
    if (config) {
      configs.push(config);
    }
    return true;
  });
  return configs;
}

/** Band edge keys grouped by y-axis id (deduplicated, insertion order). */
export function bandKeysByAxis(
  configs: Pick<BandConfig, "yAxisId" | "upperKey" | "lowerKey">[]
): Record<string, string[]> {
  const byAxis: Record<string, string[]> = {};
  for (const config of configs) {
    const keys = byAxis[config.yAxisId] ?? [];
    for (const key of [config.upperKey, config.lowerKey]) {
      if (!keys.includes(key)) {
        keys.push(key);
      }
    }
    byAxis[config.yAxisId] = keys;
  }
  return byAxis;
}

export interface ProjectionLineConfig {
  data: ProjectionPoint[];
  yAxisId: string;
}

interface ProjectionLineConfigProps {
  data?: ProjectionPoint[];
  yAxisId?: string | number;
}

function normalizeProjectionData(
  data: ProjectionPoint[] | undefined
): ProjectionPoint[] {
  if (!data?.length) {
    return [];
  }
  return data.map((point) => ({
    date: point.date instanceof Date ? point.date : new Date(point.date),
    value: point.value,
  }));
}

/** Collect {@link ProjectionLine} props from chart children for domain extension. */
export function extractProjectionLineConfigs(
  children: ReactNode
): ProjectionLineConfig[] {
  const configs: ProjectionLineConfig[] = [];
  walkChartChildren(children, (child) => {
    if (getChartChildName(child) !== "ProjectionLine") {
      return false;
    }
    const props = child.props as ProjectionLineConfigProps | undefined;
    const data = normalizeProjectionData(props?.data);
    if (data.length >= 2) {
      configs.push({ data, yAxisId: normalizeYAxisId(props?.yAxisId) });
    }
    return true;
  });
  return configs;
}

export function mergeProjectionYDomain(
  domain: [number, number],
  configs: ProjectionLineConfig[],
  yAxisId: string
): [number, number] {
  const paths = configs
    .filter((config) => config.yAxisId === yAxisId)
    .map((config) => config.data);
  const extents = projectionValueExtents(paths);
  if (!extents) {
    return domain;
  }

  const [min, max] = domain;
  const nextMin = Math.min(min, extents.minValue);
  const nextMax = Math.max(max, extents.maxValue);

  if (nextMin >= 0 && min >= 0) {
    return [0, nextMax <= 0 ? 100 : nextMax * 1.1];
  }

  const padding = (nextMax - nextMin) * 0.05 || 1;
  return [nextMin - padding, nextMax + padding];
}

export function mergeProjectionXDomainMax(
  maxTime: number,
  configs: ProjectionLineConfig[]
): number {
  const paths = configs.map((config) => config.data);
  const extents = projectionDateExtents(paths);
  if (!extents) {
    return maxTime;
  }
  return Math.max(maxTime, extents.maxTime);
}
