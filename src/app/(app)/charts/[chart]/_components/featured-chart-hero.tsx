"use client";

import type { ReactNode } from "react";
import type { ChartExamplePreviewLayout } from "./chart-example-preview";

import { ChartExampleFrame } from "./chart-example-frame";

export function FeaturedChartHero({
  anchorId,
  chartSlug,
  title,
  description,
  code,
  data,
  footer = "Trending up by 5.2% this month",
  previewLayout = "cartesian",
  children,
}: {
  anchorId?: string;
  chartSlug: string;
  title: string;
  description: string;
  code: string;
  data?: string;
  footer?: string;
  previewLayout?: ChartExamplePreviewLayout;
  children: ReactNode;
}) {
  return (
    <ChartExampleFrame
      anchorId={anchorId}
      chartSlug={chartSlug}
      code={code}
      data={data}
      description={description}
      footer={footer}
      hero
      previewLayout={previewLayout}
      title={title}
    >
      {children}
    </ChartExampleFrame>
  );
}
