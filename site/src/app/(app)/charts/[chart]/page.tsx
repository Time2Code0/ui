import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getChartParticles } from "@/lib/chart-particles";

import {
  chartTypes,
  getChartParticleCategory,
  isChartSlug,
} from "../chart-types";
import { ChartGallerySidebar } from "./_components/chart-gallery-sidebar";
import {
  ChartParticleCard,
  ChartParticleCardSkeleton,
} from "./_components/chart-particle-card";

export default async function ChartPage({
  params,
}: PageProps<"/charts/[chart]">) {
  return (
    <Suspense>
      <ChartPageImp params={params} />
    </Suspense>
  );
}

async function ChartPageImp({
  params,
}: {
  params: PageProps<"/charts/[chart]">["params"];
}) {
  const { chart: chartSlug } = await params;

  if (!isChartSlug(chartSlug)) {
    notFound();
  }

  const particles = getChartParticles(getChartParticleCategory(chartSlug));
  const chart = chartTypes.find((type) => type.slug === chartSlug);
  const notice = chart && "notice" in chart ? chart.notice : undefined;

  const anchorIds = createChartGalleryAnchorIds(
    particles.map((particle) => particle.title)
  );
  const anchors = particles.map((particle, index) => ({
    featured: particle.meta?.hero === true,
    id: anchorIds[index] ?? particle.name,
    label: chartGalleryAnchorLabel(particle.title),
  }));

  return (
    <section className="relative w-full px-4 py-12 sm:px-6">
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,4fr)] lg:gap-10">
        <ChartGallerySidebar anchors={anchors} />

        <div className="flex min-w-0 flex-col gap-6 lg:gap-8">
          {notice ? (
            <div className="rounded-xl border bg-background px-4 py-3 text-foreground-muted text-sm shadow-xs/5">
              {notice}
            </div>
          ) : null}

          {particles.map((particle, index) => (
            <Suspense
              fallback={<ChartParticleCardSkeleton />}
              key={particle.name}
            >
              <ChartParticleCard
                anchorId={anchorIds[index]}
                name={particle.name}
              />
            </Suspense>
          ))}
        </div>
      </div>
    </section>
  );
}

const titleSeparatorPattern = /\s+[-–—]\s+/;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "Area Chart - Pattern Background" → "Pattern Background". */
function chartGalleryAnchorLabel(title: string) {
  const parts = title.split(titleSeparatorPattern);
  const label = parts.length > 1 ? parts.slice(1).join(" – ") : title;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Stable, unique anchor ids for a chart page's variations (in render order). */
function createChartGalleryAnchorIds(titles: string[]) {
  const seen = new Map<string, number>();

  return titles.map((title) => {
    const base = slugify(chartGalleryAnchorLabel(title)) || "chart";
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  });
}
