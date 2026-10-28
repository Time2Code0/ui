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

const sankeyAnalytics = {
  links: [
    { source: 0, target: 4, value: 4200 },
    { source: 0, target: 5, value: 1500 },
    { source: 1, target: 5, value: 3100 },
    { source: 1, target: 6, value: 2200 },
    { source: 2, target: 4, value: 2800 },
    { source: 2, target: 6, value: 600 },
    { source: 3, target: 5, value: 1800 },
    { source: 3, target: 6, value: 1100 },
    { source: 4, target: 7, value: 3500 },
    { source: 4, target: 8, value: 3500 },
    { source: 5, target: 7, value: 4200 },
    { source: 5, target: 8, value: 2200 },
    { source: 6, target: 7, value: 2500 },
    { source: 6, target: 8, value: 1400 },
  ],
  nodes: [
    { category: "source" as const, name: "Organic" },
    { category: "source" as const, name: "Paid" },
    { category: "source" as const, name: "Social" },
    { category: "source" as const, name: "Direct" },
    { category: "landing" as const, name: "Blog" },
    { category: "landing" as const, name: "Pricing" },
    { category: "landing" as const, name: "Product" },
    { category: "outcome" as const, name: "Converted" },
    { category: "outcome" as const, name: "Bounced" },
  ],
};

export function Particle() {
  return (
    <SankeyLabeledExampleChart
      aspectRatio="4 / 3"
      data={sankeyAnalytics}
      nodePadding={24}
      nodeWidth={16}
    >
      <SankeyLink />
      <SankeyNode labelOrientation="vertical" lineCap={4} />
      <SankeyTooltip />
    </SankeyLabeledExampleChart>
  );
}
