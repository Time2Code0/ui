import type { RegistryItem } from "@shadcn/registry/schema";

import { registryItemSchema, registrySchema } from "@shadcn/registry/schema";

import { CliError } from "./errors";

const DEFAULT_REGISTRY_URL = "https://design.time2code.dev/r";

/** The namespace of the registry, e.g. `@time2code/button`. */
export const REGISTRY_NAMESPACE = "@time2code";

const NAME_PLACEHOLDER = "{name}";

const itemReferenceRegex = /^(?:@|https?:\/\/|\.{0,2}\/)|\.json$/;
const trailingWildcardRegex = /\/*\*?$/;
const whitespaceRegex = /\s+/;

export type ItemKind =
  | "block"
  | "component"
  | "example"
  | "hook"
  | "style"
  | "ui";

export const ITEM_KINDS: ItemKind[] = [
  "ui",
  "component",
  "hook",
  "block",
  "style",
  "example",
];

/**
 * The URL template of the registry items, e.g.
 * `https://design.time2code.dev/r/{name}.json`. `REGISTRY_URL` overrides the
 * default with a base URL (`http://localhost:3000/r`, a trailing `/*` is
 * fine) or a template with `{name}`.
 */
export function getRegistryTemplate(override?: string) {
  const url = override ?? process.env.REGISTRY_URL ?? DEFAULT_REGISTRY_URL;

  if (url.includes(NAME_PLACEHOLDER)) {
    return url;
  }

  return `${url.replace(trailingWildcardRegex, "")}/${NAME_PLACEHOLDER}.json`;
}

export function getItemUrl(name: string, template = getRegistryTemplate()) {
  return template.replace(NAME_PLACEHOLDER, name);
}

/**
 * Turns `button` into `@time2code/button`, which the registry engine resolves
 * through the namespace. Other namespaces, URLs and local `.json` files are
 * passed through, so any shadcn registry item still works.
 */
export function resolveItem(item: string) {
  return itemReferenceRegex.test(item) ? item : `${REGISTRY_NAMESPACE}/${item}`;
}

/** Particles are usage examples of other items, not installed on their own. */
export function getItemKind(item: Pick<RegistryItem, "files" | "type">) {
  if (item.files?.some((file) => file.path.includes("/particles/"))) {
    return "example";
  }

  const kind = item.type.replace("registry:", "");

  return ITEM_KINDS.includes(kind as ItemKind)
    ? (kind as ItemKind)
    : "component";
}

const indexCache = new Map<string, Promise<RegistryItem[]>>();

async function fetchJson(url: string) {
  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw new CliError(`Could not reach the registry at ${url}.`, {
      cause: error,
      hint: error instanceof Error ? error.message : undefined,
    });
  }

  if (!response.ok) {
    throw new CliError(
      `The registry responded with ${response.status} ${response.statusText} for ${url}.`
    );
  }

  return await response.json();
}

/** All items of the registry, without file contents. */
export function fetchRegistryIndex(template = getRegistryTemplate()) {
  let index = indexCache.get(template);

  if (!index) {
    index = fetchJson(getItemUrl("registry", template)).then(
      (json) => registrySchema.parse(json).items as RegistryItem[]
    );
    index.catch(() => indexCache.delete(template));
    indexCache.set(template, index);
  }

  return index;
}

/** A single item, including the contents of its files. */
export async function fetchRegistryItem(
  name: string,
  template = getRegistryTemplate()
) {
  return registryItemSchema.parse(await fetchJson(getItemUrl(name, template)));
}

export interface SearchOptions {
  kinds?: ItemKind[];
  query?: string;
}

/**
 * Items whose name, title, description or categories contain every word of
 * the query, best matches first.
 */
export function searchItems(items: RegistryItem[], options: SearchOptions) {
  const terms =
    options.query?.toLowerCase().split(whitespaceRegex).filter(Boolean) ?? [];

  return items
    .filter(
      (item) => !options.kinds || options.kinds.includes(getItemKind(item))
    )
    .map((item) => {
      const name = item.name.toLowerCase();
      const haystack = [
        name,
        item.title,
        item.description,
        ...(item.categories ?? []),
      ]
        .join(" ")
        .toLowerCase();

      if (!terms.every((term) => haystack.includes(term))) {
        return null;
      }

      let score = 0;
      for (const term of terms) {
        if (name === term) {
          score += 3;
        } else if (name.startsWith(term)) {
          score += 2;
        } else if (name.includes(term)) {
          score += 1;
        }
      }

      return { item, score };
    })
    .filter((result) => result !== null)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.item);
}
