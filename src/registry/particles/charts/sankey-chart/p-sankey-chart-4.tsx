"use client";

import type { ComponentProps } from "react";

import { SankeyChart } from "@/registry/charts/sankey/sankey-chart";
import { SankeyLink } from "@/registry/charts/sankey/sankey-link";
import { SankeyNode } from "@/registry/charts/sankey/sankey-node";
import { SankeyTooltip } from "@/registry/charts/sankey/sankey-tooltip";

const SANKEY_LABELED_EXAMPLE_MARGIN = {
  bottom: 40,
  left: 56,
  right: 56,
  top: 20,
} as const;

function SankeyLabeledExampleChart({
  margin,
  ...props
}: ComponentProps<typeof SankeyChart>) {
  return (
    <div className="px-2 py-1 sm:px-4">
      <SankeyChart
        {...props}
        margin={{ ...SANKEY_LABELED_EXAMPLE_MARGIN, ...margin }}
      />
    </div>
  );
}

const sankeySimple = {
  links: [
    { source: 0, target: 2, value: 40 },
    { source: 0, target: 3, value: 20 },
    { source: 1, target: 2, value: 30 },
    { source: 1, target: 3, value: 35 },
    { source: 2, target: 4, value: 70 },
    { source: 3, target: 4, value: 55 },
  ],
  nodes: [
    { category: "source" as const, name: "A" },
    { category: "source" as const, name: "B" },
    { category: "landing" as const, name: "X" },
    { category: "landing" as const, name: "Y" },
    { category: "outcome" as const, name: "Z" },
  ],
};

export function Particle() {
  return (
    <SankeyLabeledExampleChart
      aspectRatio="4 / 3"
      data={sankeySimple}
      nodePadding={20}
      nodeWidth={12}
    >
      <SankeyLink strokeOpacity={0.5} />
      <SankeyNode labelOrientation="vertical" lineCap={3} />
      <SankeyTooltip />
    </SankeyLabeledExampleChart>
  );
}
