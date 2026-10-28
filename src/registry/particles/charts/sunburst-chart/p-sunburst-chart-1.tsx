"use client";

import type { SunburstNode } from "@/registry/charts/sunburst-data";

import { useEffect, useMemo, useState } from "react";

import { buildArcs } from "@/registry/charts/sunburst";
import {
  SunburstBreadcrumb,
  useSunburstBreadcrumbItems,
} from "@/registry/charts/sunburst-breadcrumb";
import { SunburstCenter } from "@/registry/charts/sunburst-center";
import { SunburstChart } from "@/registry/charts/sunburst-chart";
import { SunburstHint } from "@/registry/charts/sunburst-hint";
import { SunburstLabels } from "@/registry/charts/sunburst-labels";
import { SunburstSegment } from "@/registry/charts/sunburst-segment";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/ui/breadcrumb";

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

function SunburstDrillBreadcrumb() {
  const { items, zoomTo } = useSunburstBreadcrumbItems();

  return (
    <BreadcrumbList>
      {items.map((item, index) => (
        <span className="contents" key={item.id}>
          {index > 0 ? <BreadcrumbSeparator /> : null}
          <BreadcrumbItem>
            {item.isCurrent ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                render={
                  <button onClick={() => zoomTo(item.id)} type="button" />
                }
              >
                {item.label}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </span>
      ))}
    </BreadcrumbList>
  );
}

export function Particle() {
  const { arcs, rootId } = useMemo(() => buildArcs(sunburstDemoData), []);
  const [focusId, setFocusId] = useState(rootId);

  useEffect(() => {
    setFocusId(rootId);
  }, [rootId]);

  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,480px)] sm:max-w-[440px]">
      <SunburstChart
        data={sunburstDemoData}
        focusId={focusId}
        onFocusChange={setFocusId}
        size={460}
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
    </div>
  );
}
