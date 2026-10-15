import "server-only";

import { cache } from "react";

import { loadRegistryItem } from "shadcn/registry";

export const getRegistryItem = cache(async (name: string) => {
  const item = await loadRegistryItem(name);

  return {
    ...item,
    files: item.files?.map((file) => ({
      ...file,
      content: file.content ? fixImport(file.content) : undefined,
    })),
  };
});

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
