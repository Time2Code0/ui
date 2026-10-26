import { notFound } from "next/navigation";

import { isChartSlug } from "../chart-types";
import { ChartExamplesGrid } from "./examples";

export default async function ChartPage({
  params,
}: PageProps<"/charts/[chart]">) {
  const { chart } = await params;

  if (!isChartSlug(chart)) {
    notFound();
  }

  return <ChartExamplesGrid chartSlug={chart} />;
}
