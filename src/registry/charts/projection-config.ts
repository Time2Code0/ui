import type { ReactNode } from "react";
import type { ProjectionPoint } from "./projection-utils";

import { getChartChildName, walkChartChildren } from "./chart-children";
import {
  projectionDateExtents,
  projectionValueExtents,
} from "./projection-utils";
import { normalizeYAxisId } from "./y-axis-scales";

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
