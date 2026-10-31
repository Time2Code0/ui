import { createMetadata } from "@/lib/metadata";

import { BlocksList } from "./blocks-list";

export const metadata = createMetadata({
  description:
    "Ready-made pages and sections built from time2code/ui components, ready to add to your project.",
  openGraph: { url: "/blocks" },
  title: "Blocks",
});

export default function Page() {
  return <BlocksList category="featured" />;
}
