"use client";

import { useEffect, useMemo, useState } from "react";

import {
  buildArcs,
  SunburstBreadcrumb,
  SunburstCenter,
  SunburstChart,
  SunburstHint,
  SunburstLabels,
  SunburstSegment,
} from "../_charts";
import { SunburstDrillBreadcrumb } from "../_components/sunburst-drill-breadcrumb";
import { sunburstDemoData } from "../_data/sunburst-chart-demo-data";

export function SunburstChartDemo() {
  const { arcs, rootId } = useMemo(() => buildArcs(sunburstDemoData), []);
  const [focusId, setFocusId] = useState(rootId);

  useEffect(() => {
    setFocusId(rootId);
  }, [rootId]);

  return (
    <SunburstChart
      className="mx-auto"
      data={sunburstDemoData}
      focusId={focusId}
      onFocusChange={setFocusId}
      size={440}
    >
      <SunburstBreadcrumb>
        <SunburstDrillBreadcrumb />
      </SunburstBreadcrumb>
      {arcs.map((arc) => (
        <SunburstSegment index={arc.arcIndex} key={arc.id} />
      ))}
      <SunburstCenter />
      <SunburstLabels />
      <SunburstHint />
    </SunburstChart>
  );
}
