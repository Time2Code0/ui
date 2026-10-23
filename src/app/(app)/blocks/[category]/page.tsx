import { Suspense } from "react";
import { notFound } from "next/navigation";

import { blockNavItems } from "@/lib/blocks";
import { createMetadata } from "@/lib/metadata";

import { BlocksList } from "../blocks-list";

const categories = blockNavItems.filter((item) => item.name !== "featured");

export function generateStaticParams() {
  return categories.map((item) => ({ category: item.name }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blocks/[category]">) {
  const { category } = await params;
  const label =
    categories.find((item) => item.name === category)?.label ?? category;

  return createMetadata({
    description: `${label} blocks built from Akari components, ready to add to your project.`,
    openGraph: { url: `/blocks/${category}` },
    title: `${label} Blocks`,
  });
}

export default function Page({ params }: PageProps<"/blocks/[category]">) {
  return (
    <Suspense>
      <CategoryBlocks params={params} />
    </Suspense>
  );
}

async function CategoryBlocks({
  params,
}: Pick<PageProps<"/blocks/[category]">, "params">) {
  const { category } = await params;

  if (!categories.some((item) => item.name === category)) {
    notFound();
  }

  return <BlocksList category={category} />;
}
