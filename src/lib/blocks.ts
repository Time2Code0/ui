import "server-only";

import registry from "@/registry/blocks/registry.json";

export const blockCategories = [
  { label: "Featured", name: "featured" },
  { label: "Authentication", name: "authentication" },
  { label: "Sidebar", name: "sidebar" },
  { label: "App Shell", name: "app-shell" },
  { label: "Navigation", name: "navigation" },
  { label: "Dashboard", name: "dashboard" },
  { label: "Settings", name: "settings" },
  { label: "eCommerce", name: "ecommerce" },
];

export function getBlocks(category: string) {
  return registry.items.filter((block) => block.categories.includes(category));
}

// Featured lives at /blocks and is always listed, the other categories only
// show up in the navigation once the registry contains a block for them.
export const blockNavItems = blockCategories
  .filter(
    (category) =>
      category.name === "featured" || getBlocks(category.name).length > 0
  )
  .map((category) => ({
    href: category.name === "featured" ? "/blocks" : `/blocks/${category.name}`,
    label: category.label,
    name: category.name,
  }));

export const blockNames = registry.items.map((block) => block.name);

export interface FileTree {
  children?: FileTree[];
  name: string;
  path?: string;
}

export function createFileTree(files: { path: string; target?: string }[]) {
  const root: FileTree[] = [];

  for (const file of files) {
    const parts = getFileTarget(file).split("/");
    let level = root;

    for (const [index, part] of parts.entries()) {
      const isFile = index === parts.length - 1;
      let node = level.find((candidate) => candidate.name === part);

      if (!node) {
        node = isFile
          ? { name: part, path: file.path }
          : { children: [], name: part };
        level.push(node);
      }

      level = node.children ?? [];
    }
  }

  return sortFileTree(root);
}

// `~/` is the project root and `@components/` an alias target in shadcn, both
// read better without the prefix.
const targetPrefixRegex = /^(?:~\/|@)/;

export function getFileTarget(file: { path: string; target?: string }) {
  return (file.target || file.path).replace(targetPrefixRegex, "");
}

// Folders first, then files, both alphabetically.
function sortFileTree(nodes: FileTree[]): FileTree[] {
  return nodes
    .map((node) =>
      node.children ? { ...node, children: sortFileTree(node.children) } : node
    )
    .sort((a, b) => {
      if (Boolean(a.children) !== Boolean(b.children)) {
        return a.children ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });
}
