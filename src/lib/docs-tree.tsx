import type * as PageTree from "fumadocs-core/page-tree";

import {
  AiSparklesIcon,
  DropdownFieldTypeIcon,
  RocketIcon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons";
import { flattenTree } from "fumadocs-core/page-tree";

import { Icon } from "@/registry/ui/icon";

const SECTION_ICONS = {
  Code: SourceCodeIcon,
  Dropdown: DropdownFieldTypeIcon,
  Rocket: RocketIcon,
  Sparkles: AiSparklesIcon,
} as const;

const transform = (option: LayoutTab, node: PageTree.Folder) => {
  if (!node.icon) {
    return option;
  }

  const icon =
    node.icon && typeof node.icon === "string" && node.icon in SECTION_ICONS
      ? SECTION_ICONS[node.icon as keyof typeof SECTION_ICONS]
      : null;

  if (!icon) {
    return option;
  }

  return {
    ...option,
    icon: <Icon icon={icon} />,
  };
};

export interface LayoutTab {
  /**
   * bind to a page tree node.
   */
  $folder?: PageTree.Folder;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  props?: React.ComponentProps<"a">;
  title: React.ReactNode;
  unlisted?: boolean;
  /**
   * Redirect URL of the folder, usually the index page
   */
  url: string;

  /**
   * Detect from a list of urls (when not bound to page tree).
   */
  urls?: Set<string>;
}

export function getLayoutTabs(tree: PageTree.Root): LayoutTab[] {
  const results: LayoutTab[] = [];

  function next(node: PageTree.Root | PageTree.Folder, unlisted?: boolean) {
    if ("root" in node && node.root) {
      const url =
        node.index?.url ?? node.children.find((n) => n.type === "page")?.url;

      if (url) {
        const option: LayoutTab = {
          $folder: node,
          description: node.description,
          icon: node.icon,
          title: node.name,
          unlisted,
          url,
        };

        const mapped = transform(option, node);
        if (mapped) {
          results.push(mapped);
        }
      }
    }

    for (const child of node.children) {
      if (child.type === "folder") {
        next(child, unlisted);
      }
    }
  }

  next(tree);
  if (tree.fallback) {
    next(tree.fallback, true);
  }

  return results;
}

export function isLayoutTabActive(
  tab: LayoutTab,
  path: PageTree.Node[],
  pathname: string
) {
  if (tab.$folder) {
    const folder = tab.$folder;
    return path.some(
      (node) =>
        node.type === "folder" && (node.$id === folder.$id || node === folder)
    );
  }

  if (tab.urls) {
    return tab.urls.has(normalize(pathname));
  }

  const normalizedHref = normalize(tab.url);
  const normalizedPathname = normalize(pathname);

  return (
    normalizedHref === normalizedPathname ||
    normalizedPathname.startsWith(`${normalizedHref}/`)
  );
}

function normalize(urlOrPath: string) {
  if (urlOrPath.length > 1 && urlOrPath.endsWith("/")) {
    return urlOrPath.slice(0, -1);
  }

  return urlOrPath;
}

/**
 * Splits a root folder into sidebar groups, each a folder of pages: the leading pages (unnamed: the
 * section's name already says what they are), one group per `---Separator---`, and one per nested
 * folder, its pages flattened.
 */
export function groupsOf(root: PageTree.Folder): PageTree.Folder[] {
  const groups: PageTree.Folder[] = [];
  let current: PageTree.Folder | undefined;

  // Fumadocs only sets `index` when meta.json doesn't place it among the children.
  const nodes = root.index ? [root.index, ...root.children] : root.children;

  for (const node of nodes) {
    if (node.type === "folder") {
      groups.push(group(node.$id, node.name, flattenTree([node])));
      current = undefined;
    } else if (node.type === "separator") {
      current = group(node.$id, node.name ?? "");
      groups.push(current);
    } else {
      if (!current) {
        current = group(node.url, "");
        groups.push(current);
      }

      // A page named like its section (UI's index, "UI Components") reads "Overview".
      current.children.push(
        node.name === root.name ? { ...node, name: "Overview" } : node
      );
    }
  }

  return groups.filter((g) => g.children.length > 0);
}

function group(
  $id: string | undefined,
  name: React.ReactNode,
  children: PageTree.Node[] = []
): PageTree.Folder {
  return { $id, children, name, type: "folder" };
}
