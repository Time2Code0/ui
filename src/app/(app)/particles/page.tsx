import { Suspense } from "react";

import { createMetadata } from "@/lib/metadata";
import { particleCategories, particleSearchItems } from "@/lib/particles";

import { ParticlesDisplay } from "./particles-display";
import { ParticlesSearch } from "./particles-search";

const description =
  "Discover countless ready-to-use particles, the building blocks of your design system. Filter by one or more components or tags to find the perfect fit for your project.";

export const metadata = createMetadata({
  description,
  openGraph: { url: "/particles" },
  title: "Browse Particles",
});

function ParticlesDisplayServer({ categories }: { categories: string[] }) {
  const validCategories = categories.filter((category) =>
    particleCategories.includes(category)
  );
  const invalidCategories = categories.filter(
    (category) => !particleCategories.includes(category)
  );

  if (invalidCategories.length > 0) {
    return (
      <p className="pb-12 text-center text-foreground-muted">
        No particles found for the selected filters
      </p>
    );
  }

  if (validCategories.length === 0) {
    return null;
  }

  return <ParticlesDisplay selectedCategories={validCategories} />;
}

export default async function Page({ searchParams }: PageProps<"/particles">) {
  const { tags } = await searchParams;
  const categories =
    (typeof tags === "string" ? tags : tags?.join(","))
      ?.split(",")
      .filter(Boolean) ?? [];

  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl pt-16 pb-8 text-center md:pt-20">
        <h1 className="font-semibold text-3xl xl:text-4xl">Browse Particles</h1>
        <p className="mt-3 text-balance text-foreground-muted text-lg">
          {description}
        </p>
      </div>

      <div className="mx-auto mb-8 max-w-2xl md:mb-12 lg:mb-16">
        <Suspense>
          <ParticlesSearch categories={particleSearchItems} />
        </Suspense>
      </div>

      <Suspense>
        <ParticlesDisplayServer categories={categories} />
      </Suspense>
    </main>
  );
}
