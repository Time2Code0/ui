import type { ReactNode } from "react";
import type { BandConfig } from "./chart-context";

import { getChartChildName, walkChartChildren } from "./chart-children";
import { normalizeYAxisId } from "./y-axis-scales";

export type { BandConfig } from "./chart-context";

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
