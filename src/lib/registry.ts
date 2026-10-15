import "server-only";

import { cacheLife } from "next/cache";

import { loadRegistry, loadRegistryItem } from "shadcn/registry";

export async function getParticles(selectedCategories: string[]) {
  "use cache";
  cacheLife("max");

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
}

export async function getRegistryItem(name: string) {
  "use cache";
  cacheLife("max");

  const item = await loadRegistryItem(name);

  return {
    ...item,
    files: item.files?.map((file) => ({
      ...file,
      content: file.content ? fixImport(file.content) : undefined,
    })),
  };
}

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

function fixImport(content: string) {
  const regex = /@\/(.+?)\/((?:.*?\/)?(?:components|ui|hooks|lib))\/([\w-]+)/g;

  const replacement = (
    match: string,
    _path: string,
    type: string,
    component: string
  ) => {
    if (type.endsWith("components")) {
      return `@/components/${component}`;
    }
    if (type.endsWith("ui")) {
      return `@/components/ui/${component}`;
    }
    if (type.endsWith("marketing")) {
      return `@/components/marketing/${component}`;
    }
    if (type.endsWith("hooks")) {
      return `@/hooks/${component}`;
    }
    if (type.endsWith("lib")) {
      return `@/lib/${component}`;
    }

    return match;
  };

  return content.replace(regex, replacement);
}
