import { ComponentRenderer } from "@/components/component-renderer";
import { ComponentSource } from "@/components/component-source";
import { siteConfig } from "@/lib/config";
import { getRegistryItem } from "@/lib/registry";
import { Skeleton } from "@/registry/ui/skeleton";

import { ChartExampleFrame } from "./chart-example-frame";
import {
  type ChartExamplePreviewLayout,
  chartExamplePreviewLayouts,
} from "./chart-example-preview";

function isPreviewLayout(value: unknown): value is ChartExamplePreviewLayout {
  return chartExamplePreviewLayouts.includes(
    value as ChartExamplePreviewLayout
  );
}

/** One chart particle: live preview, highlighted source, registry URL. */
export async function ChartParticleCard({
  name,
  anchorId,
}: {
  name: string;
  anchorId?: string;
}) {
  const registryUrl = `${siteConfig.url}/r/${name}.json`;
  const particle = await getRegistryItem(name);
  const { footer, hero, previewLayout } = particle.meta ?? {};

  return (
    <ChartExampleFrame
      anchorId={anchorId}
      code={
        <ComponentSource
          codeblock={{
            className: "my-0 border-0 bg-transparent",
            "data-line-numbers": true,
          }}
          language="tsx"
          name={name}
          title=""
        />
      }
      description={particle.description ?? ""}
      footer={typeof footer === "string" ? footer : undefined}
      hero={hero === true}
      previewLayout={isPreviewLayout(previewLayout) ? previewLayout : undefined}
      registryUrl={registryUrl}
      title={particle.title ?? name}
    >
      <ComponentRenderer metaClassName="w-full" name={name} />
    </ChartExampleFrame>
  );
}

export function ChartParticleCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border p-1">
      <div className="flex flex-col gap-1 px-5 py-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <Skeleton className="h-160 rounded-xl lg:h-112" />
      <Skeleton className="h-34 rounded-xl" />
    </div>
  );
}
