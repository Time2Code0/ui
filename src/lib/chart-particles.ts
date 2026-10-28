import "server-only";

import registry from "@/registry/particles/charts/registry.json";

/** A chart page's particles, in registry order (the hero comes first). */
export function getChartParticles(category: string) {
  return registry.items.filter((item) => item.categories[0] === category);
}
