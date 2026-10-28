"use client";

import type { SunburstNode } from "@/registry/charts/sunburst-data";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Legend } from "@/registry/charts/legend/legend";
import { LegendItem as LegendItemComponent } from "@/registry/charts/legend/legend-item";
import { LegendLabel } from "@/registry/charts/legend/legend-label";
import { LegendMarker } from "@/registry/charts/legend/legend-marker";
import { LegendValue } from "@/registry/charts/legend/legend-value";
import { buildArcs, sumValues } from "@/registry/charts/sunburst";
import { SunburstCenter } from "@/registry/charts/sunburst-center";
import { SunburstChart } from "@/registry/charts/sunburst-chart";
import { SunburstSegment } from "@/registry/charts/sunburst-segment";

const sunburstDemoData: SunburstNode = {
  children: [
    {
      children: [
        {
          children: [
            {
              children: [
                { name: "Direct", value: 52 },
                { name: "Channel", value: 38 },
              ],
              name: "North America",
            },
            { name: "EMEA", value: 60 },
            { name: "APAC", value: 48 },
          ],
          name: "Enterprise",
        },
        {
          children: [
            { name: "Teams", value: 90 },
            { name: "Solo", value: 55 },
          ],
          name: "Pro",
        },
        { name: "Starter", value: 95 },
      ],
      name: "Product",
    },
    {
      children: [
        {
          children: [
            { name: "Strategy", value: 72 },
            { name: "Implementation", value: 88 },
          ],
          name: "Consulting",
        },
        {
          children: [
            { name: "Premium", value: 48 },
            { name: "Standard", value: 42 },
          ],
          name: "Support",
        },
        { name: "Training", value: 55 },
      ],
      name: "Services",
    },
    {
      children: [
        { name: "Referrals", value: 120 },
        { name: "Affiliates", value: 75 },
        {
          children: [
            { name: "Regional", value: 64 },
            { name: "Global", value: 46 },
          ],
          name: "Resellers",
        },
      ],
      name: "Partners",
    },
    {
      children: [
        { name: "Licensing", value: 85 },
        { name: "Events", value: 42 },
      ],
      name: "Other",
    },
  ],
  name: "Revenue",
};

function findSunburstNodeById(
  node: SunburstNode,
  id: string,
  parentId: string | null = null
): SunburstNode | null {
  const nodeId = parentId ? `${parentId} / ${node.name}` : node.name;
  if (nodeId === id) {
    return node;
  }
  for (const child of node.children ?? []) {
    const found = findSunburstNodeById(child, id, nodeId);
    if (found) {
      return found;
    }
  }
  return null;
}

function sunburstLegendForFocus(data: SunburstNode, focusId: string) {
  const { arcs, rootId } = buildArcs(data);
  const focusNode = findSunburstNodeById(data, focusId) ?? data;
  const children = focusNode.children ?? [];
  const childValues = children.map((child) => sumValues(child));
  const maxValue = Math.max(...childValues, 1);

  const items: { label: string; value: number; color: string }[] = [];
  const arcIndices: number[] = [];

  for (const child of children) {
    const childId =
      focusId === rootId ? child.name : `${focusId} / ${child.name}`;
    const arc = arcs.find((entry) => entry.id === childId);
    if (!arc) {
      continue;
    }
    items.push({
      color: `var(--color-chart-${(arc.categoryIndex % 5) + 1})`,
      label: child.name,
      value: sumValues(child),
    });
    arcIndices.push(arc.arcIndex);
  }

  return {
    arcIndices,
    items: items.map((item) => ({ ...item, maxValue })),
  };
}

export function Particle() {
  const { arcs, rootId } = useMemo(() => buildArcs(sunburstDemoData), []);
  const [focusId, setFocusId] = useState(rootId);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [legendHoveredIndex, setLegendHoveredIndex] = useState<number | null>(
    null
  );

  const legendResult = useMemo(
    () => sunburstLegendForFocus(sunburstDemoData, focusId),
    [focusId]
  );

  const legendIndexByArc = useMemo(() => {
    const map = new Map<number, number>();
    for (const [legendIndex, arcIndex] of legendResult.arcIndices.entries()) {
      map.set(arcIndex, legendIndex);
    }
    return map;
  }, [legendResult.arcIndices]);

  useEffect(() => {
    setFocusId(rootId);
  }, [rootId]);

  useEffect(() => {
    if (legendHoveredIndex != null) {
      const arcIndex = legendResult.arcIndices[legendHoveredIndex];
      if (arcIndex != null) {
        setHoveredIndex(arcIndex);
      }
      return;
    }
    setHoveredIndex((current) =>
      current != null && legendIndexByArc.has(current) ? null : current
    );
  }, [legendHoveredIndex, legendResult.arcIndices, legendIndexByArc]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset hover when drill focus changes
  useEffect(() => {
    setHoveredIndex(null);
    setLegendHoveredIndex(null);
  }, [focusId]);

  const handleArcHoverChange = useCallback(
    (arcIndex: number | null) => {
      setHoveredIndex(arcIndex);
      if (arcIndex == null) {
        setLegendHoveredIndex(null);
        return;
      }
      setLegendHoveredIndex(legendIndexByArc.get(arcIndex) ?? null);
    },
    [legendIndexByArc]
  );

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <SunburstChart
        data={sunburstDemoData}
        focusId={focusId}
        hoveredIndex={hoveredIndex}
        onFocusChange={setFocusId}
        onHoverChange={handleArcHoverChange}
        size={280}
      >
        {arcs.map((arc) => (
          <SunburstSegment index={arc.arcIndex} key={arc.id} />
        ))}
        <SunburstCenter />
      </SunburstChart>
      <Legend
        className="flex-row flex-wrap justify-center gap-x-4 gap-y-1"
        hoveredIndex={legendHoveredIndex}
        items={legendResult.items}
        onHoverChange={setLegendHoveredIndex}
        title="Categories"
      >
        <LegendItemComponent className="flex items-center gap-1.5">
          <LegendMarker />
          <LegendLabel className="text-xs" />
          <LegendValue className="text-xs" showPercentage />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}
