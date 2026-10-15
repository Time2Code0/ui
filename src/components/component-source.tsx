import type { CodeBlockProps } from "./codeblock";

import fs from "node:fs/promises";
import path from "node:path";

import { cacheLife } from "next/cache";

import { cn } from "cn";
import { asMarkdown, md } from "fumadocs-core/server";

import { getRegistryItem } from "@/lib/registry";

import { DynamicCodeBlock } from "./dynamic-codeblock";

export type ComponentSourceProps = {
  language?: string;
  title?: string;
  className?: string;
  codeblock?: CodeBlockProps;
} & ({ name: string; src?: never } | { name?: never; src: string });

async function readSourceFile(src: string) {
  "use cache";
  cacheLife("max");

  return await fs.readFile(path.join(process.cwd(), src), "utf-8");
}

export async function ComponentSource({
  name,
  src,
  title,
  language,
  className,
  codeblock,
}: ComponentSourceProps) {
  if (!(name || src)) {
    return null;
  }

  let code: string | undefined;

  if (name) {
    const item = await getRegistryItem(name);
    code = item.files?.[0]?.content;
  }

  if (src) {
    code = await readSourceFile(src);
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
      codeblock={{
        ...codeblock,
        className: cn("my-4", className, codeblock?.className),
        title,
      }}
      lang={lang}
    />
  );
}
