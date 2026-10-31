import type { CodeBlockProps } from "./codeblock";

import fs from "node:fs/promises";
import path from "node:path";

import { cacheLife } from "next/cache";

import { cn } from "cn";
import { asMarkdown, md } from "fumadocs-core/server";

import { getRegistryItem } from "@/lib/registry";

import { DynamicCodeBlock } from "./dynamic-codeblock";

const REGISTRY_PREFIX_REGEX = /^src\/registry\//;
const ROOT_DIRECTORY_REGEX = /^(hooks|lib)\//;

// Maps a registry source path to where the file lives in a consumer project:
// `src/registry/ui/accordion.tsx` -> `components/ui/accordion.tsx`,
// `src/registry/hooks/use-clock.ts` -> `hooks/use-clock.ts`.
function normalizeFilePath(filePath: string) {
  const relativePath = filePath.replace(REGISTRY_PREFIX_REGEX, "");

  if (ROOT_DIRECTORY_REGEX.test(relativePath)) {
    return relativePath;
  }

  return `components/${relativePath}`;
}

async function readSourceFile(src: string) {
  "use cache";
  cacheLife("max");

  return await fs.readFile(path.join(process.cwd(), src), "utf-8");
}

export type ComponentSourceProps = {
  language?: string;
  title?: string;
  className?: string;
  codeblock?: CodeBlockProps;
} & (
  | {
      name: string;
      file?: string;
      src?: never;
    }
  | { name?: never; file?: never; src: string }
);

export async function ComponentSource({
  name,
  file: filePath,
  src,
  title: defaultTitle,
  language,
  className,
  codeblock,
}: ComponentSourceProps) {
  if (!(name || src)) {
    return null;
  }

  let code: string | undefined;
  let fileTitle: string | undefined;

  if (name) {
    const item = await getRegistryItem(name);
    const file = filePath
      ? item.files?.find((candidate) => candidate.path === filePath)
      : item.files?.[0];

    code = file?.content;
    fileTitle = file?.path ? normalizeFilePath(file.path) : undefined;
  }

  if (src) {
    code = await readSourceFile(src);
  }

  if (!code) {
    return null;
  }

  const title = defaultTitle ?? fileTitle;
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
