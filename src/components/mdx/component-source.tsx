import fs from "node:fs/promises";
import path from "node:path";

import { asMarkdown, md } from "fumadocs-core/server";

import { getRegistryItem } from "@/lib/registry";

import { DynamicCodeBlock } from "../dynamic-codeblock";

type ComponentSourceProps = {
  language?: string;
  title?: string;
} & ({ name: string; src?: never } | { name?: never; src: string });

export async function ComponentSource({
  name,
  src,
  title,
  language,
}: ComponentSourceProps) {
  if (!(name || src)) {
    return null;
  }

  let code: string | undefined;

  if (name) {
    const item = await getRegistryItem(name);
    code = item?.files?.[0]?.content;
  }

  if (src) {
    const file = await fs.readFile(path.join(process.cwd(), src), "utf-8");
    code = file;
  }

  if (!code) {
    return null;
  }

  const lang = language ?? title?.split(".").pop() ?? "tsx";

  if (asMarkdown()) {
    return md`\`\`\`${lang}\n${code}\n\`\`\``;
  }

  return (
    <DynamicCodeBlock
      code={code}
      codeblock={{ className: "my-4", title }}
      lang={lang}
    />
  );
}
