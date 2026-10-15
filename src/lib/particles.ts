import "server-only";

import marketingRegistry from "@/registry/marketing/registry.json";
import registry from "@/registry/particles/registry.json";

export const particleCategories = registry.items.flatMap(
  (particle) => particle.categories ?? []
);

const wordSeparatorRegex = /[\s-]/;

const primaryCategories = new Set(
  registry.items.flatMap((particle) => particle.categories?.slice(0, 1) ?? [])
);

const marketingCategories = new Set(
  marketingRegistry.items.map((item) => item.name)
);

function isMarketingCategory(category: string) {
  return marketingCategories.has(category.replaceAll(" ", "-"));
}

function toSearchItem(value: string) {
  return {
    label: value
      .split(wordSeparatorRegex)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    value,
  };
}

const sortedCategories = Array.from(new Set(particleCategories)).sort(
  (a, b) => {
    const aPrimary = primaryCategories.has(a);
    const bPrimary = primaryCategories.has(b);

    if (aPrimary !== bPrimary) {
      return aPrimary ? -1 : 1;
    }

    return a.localeCompare(b);
  }
);

export const particleSearchItems: {
  value: string;
  items: { label: string; value: string }[];
}[] = [
  {
    items: sortedCategories
      .filter((category) => !isMarketingCategory(category))
      .map(toSearchItem),
    value: "UI",
  },
  {
    items: sortedCategories.filter(isMarketingCategory).map(toSearchItem),
    value: "Marketing",
  },
];
