import { Suspense } from "react";

import { BlockDisplay } from "@/components/block-display";
import { getBlocks } from "@/lib/blocks";
import { Skeleton } from "@/registry/ui/skeleton";

export function BlocksList({ category }: { category: string }) {
  const blocks = getBlocks(category);

  if (blocks.length === 0) {
    return (
      <p className="px-4 py-16 text-center text-foreground-muted sm:px-6">
        No blocks in this category yet.
      </p>
    );
  }

  return (
    <div>
      {blocks.map((block) => (
        <Suspense fallback={<BlockDisplaySkeleton />} key={block.name}>
          <BlockDisplay name={block.name} />
        </Suspense>
      ))}
    </div>
  );
}

function BlockDisplaySkeleton() {
  return (
    <div aria-busy="true" className="border-b">
      <div className="px-4 py-6 sm:px-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="mt-2 h-5 w-96 max-w-full" />
      </div>
      <div className="h-12 border-t bg-background-muted" />
      <div className="h-[800px] border-t bg-background-muted" />
    </div>
  );
}
