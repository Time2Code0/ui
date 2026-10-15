import { cache, Suspense } from "react";

import { loadRegistry } from "shadcn/registry";

import { Skeleton } from "@/registry/ui/skeleton";

import { ParticleCard } from "./particle-card";
import { ParticleCardContainer } from "./particle-card-container";

function calculateRelevanceWeight(
  particle: Awaited<ReturnType<typeof loadRegistry>>["items"][number],
  searchTerms: string[]
): number {
  let weight = 0;

  for (const term of searchTerms) {
    const normalizedTerm = term.replace(/\s+/g, "-");

    if (particle.name.startsWith(`p-${normalizedTerm}-`)) {
      weight += 30;
    }

    const categories = particle.categories ?? [];
    if (categories[0] === term) {
      weight += 10;
    }
  }

  return weight;
}

const getCachedParticles = cache(async (selectedCategories: string[]) => {
  const registry = await loadRegistry();
  const particles = registry.items.filter(
    (particle) =>
      particle.type === "registry:block" && particle.name.startsWith("p-")
  );

  const filteredParticles = particles
    .filter((particle) => {
      const categories = particle.categories ?? [];
      return selectedCategories.some((value) => categories.includes(value));
    })
    .sort((a, b) => {
      const weightA = calculateRelevanceWeight(a, selectedCategories);
      const weightB = calculateRelevanceWeight(b, selectedCategories);
      return weightB - weightA;
    });

  return filteredParticles;
});

export async function ParticlesDisplay({
  selectedCategories,
}: {
  selectedCategories: string[];
}) {
  const particles = await getCachedParticles(selectedCategories);

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
