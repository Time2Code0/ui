import { notFound } from "next/navigation";

import { blockNames } from "@/lib/blocks";
import { createMetadata } from "@/lib/metadata";
import { getRegistryItem } from "@/lib/registry";
import { Index } from "@/registry/__index__";

// Only loaded in the block preview iframe or a new tab, never through in-app
// navigation, so rendering the block in one go is fine.
export const instant = false;

export function generateStaticParams() {
  return blockNames.map((name) => ({ name }));
}

export async function generateMetadata({ params }: PageProps<"/view/[name]">) {
  const { name } = await params;
  const item = await getRegistryItem(name);

  return createMetadata({
    description: item.description,
    robots: { follow: false, index: false },
    title: item.title,
  });
}

export default async function Page({ params }: PageProps<"/view/[name]">) {
  const { name } = await params;
  const Component = Index[name as keyof typeof Index];

  if (!Component) {
    notFound();
  }

  return <Component />;
}
