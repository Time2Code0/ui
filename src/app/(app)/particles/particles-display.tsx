import { Suspense } from "react";

import { getParticles } from "@/lib/registry";
import { Skeleton } from "@/registry/ui/skeleton";

import { ParticleCard } from "./particle-card";
import { ParticleCardContainer } from "./particle-card-container";

export async function ParticlesDisplay({
  selectedCategories,
}: {
  selectedCategories: string[];
}) {
  const particles = await getParticles(selectedCategories);

  if (particles.length === 0) {
    return (
      <p className="pb-12 text-center text-foreground-muted">
        No particles found for the selected filters
      </p>
    );
  }

  return (
    <div className="grid items-stretch gap-9 pb-12 lg:grid-cols-2 lg:gap-6 xl:gap-9">
      {particles.map((particle) => (
        <Suspense
          fallback={
            <ParticleCardContainer
              footer={
                <>
                  <div className="flex flex-1 gap-1">
                    <Skeleton className="size-4 shrink-0" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="size-7" />
                    <Skeleton className="h-7 w-20" />
                  </div>
                </>
              }
            >
              <Skeleton className="h-7 w-64" />
            </ParticleCardContainer>
          }
          key={particle.name}
        >
          <ParticleCard name={particle.name} />
        </Suspense>
      ))}
    </div>
  );
}
