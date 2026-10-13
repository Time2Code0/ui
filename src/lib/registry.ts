import "server-only";

import { loadRegistryItem } from "shadcn/registry";

import { Index } from "@/registry/__index__";

type RegistryName = keyof typeof Index;

type RegistryItem = Awaited<ReturnType<typeof loadRegistryItem>>;

type RegistryItemWithComponent = RegistryItem & {
  component: (typeof Index)[RegistryName];
};

const cache = new Map<RegistryName, RegistryItemWithComponent>();

export async function getRegistryItem(registryName: string) {
  if (!Object.hasOwn(Index, registryName)) {
    return null;
  }

  const name = registryName as RegistryName;

  const cached = cache.get(name);

  if (cached) {
    return cached;
  }

  const item = await loadRegistryItem(name);

  const result: RegistryItemWithComponent = {
    ...item,
    component: Index[name],
    files: item.files?.map((file) => ({
      ...file,
      content: file.content ? fixImport(file.content) : undefined,
    })),
  };

  cache.set(name, result);

  return result;
}

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
