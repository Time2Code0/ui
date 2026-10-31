"use client";

import type { SunburstNode } from "@/registry/charts/sunburst-chart/sunburst";

import { useMemo } from "react";

import { PatternLines } from "@/registry/charts/chart-patterns/visx-pattern";
import { buildArcs } from "@/registry/charts/sunburst-chart/sunburst";
import { SunburstCenter } from "@/registry/charts/sunburst-chart/sunburst-center";
import { SunburstChart } from "@/registry/charts/sunburst-chart/sunburst-chart";
import { SunburstSegment } from "@/registry/charts/sunburst-chart/sunburst-segment";

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

export function Particle() {
  const { arcs } = useMemo(() => buildArcs(sunburstDemoData), []);
  const patternedInnerArcs = arcs.filter(
    (arc) => arc.depth === 1 && arc.categoryIndex % 2 === 0
  );

  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <SunburstChart data={sunburstDemoData} size={320}>
        {patternedInnerArcs.map((arc) => (
          <PatternLines
            height={6}
            id={`sb-ex-inner-${arc.arcIndex}`}
            key={`sb-ex-inner-def-${arc.arcIndex}`}
            orientation={["diagonal"]}
            stroke={`var(--color-chart-${(arc.categoryIndex % 5) + 1})`}
            strokeWidth={1}
            width={6}
          />
        ))}
        {arcs.map((arc) => {
          const fill =
            arc.depth === 1 && arc.categoryIndex % 2 === 0
              ? `url(#sb-ex-inner-${arc.arcIndex})`
              : undefined;
          return (
            <SunburstSegment fill={fill} index={arc.arcIndex} key={arc.id} />
          );
        })}
        <SunburstCenter />
      </SunburstChart>
    </div>
  );
}
