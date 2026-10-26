import type { ReactNode } from "react";

import { getChartChildName, walkChartChildren } from "./chart-children";
import { normalizeYAxisId } from "./y-axis-scales";

export interface ReferenceAreaConfig {
  axisLabelColor?: string;
  y1?: number;
  y2?: number;
  yAxisId: string;
}

interface ReferenceAreaConfigProps {
  axisLabelColor?: string;
  y1?: number;
  y2?: number;
  yAxisId?: string | number;
}

/** Collect {@link ReferenceArea} props from chart children for axis label styling. */
export function extractReferenceAreaConfigs(
  children: ReactNode
): ReferenceAreaConfig[] {
  const configs: ReferenceAreaConfig[] = [];
  walkChartChildren(children, (child) => {
    if (getChartChildName(child) !== "ReferenceArea") {
      return false;
    }
    const props = child.props as ReferenceAreaConfigProps | undefined;
    if (props) {
      configs.push({
        axisLabelColor: props.axisLabelColor,
        y1: props.y1,
        y2: props.y2,
        yAxisId: normalizeYAxisId(props.yAxisId),
      });
    }
    return true;
  });
  return configs;
}
