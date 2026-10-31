import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { glob } from "tinyglobby";

import { readPackageJson } from "./project";

const FRAMEWORK_CONFIG_FILES = [
  "next.config.*",
  "vite.config.*",
  "astro.config.*",
  "react-router.config.*",
  "remix.config.*",
];

const keyRegex = /^(\s*)([\w-]+)\s*:/;
const listItemRegex = /^(\s*)-\s*(.+?)\s*(?:#.*)?$/;
const quotesRegex = /^["']|["']$/g;
const trailingSlashRegex = /\/$/;

export interface WorkspaceTarget {
  /** path relative to the monorepo root, e.g. `apps/web` */
  name: string;
  path: string;
}

/** The `packages` globs of a `pnpm-workspace.yaml`. */
export function parsePnpmWorkspacePackages(content: string) {
  const patterns: string[] = [];
  let inPackages = false;
  let packagesIndent = 0;

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const keyMatch = line.match(keyRegex);
    if (keyMatch) {
      packagesIndent = keyMatch[1].length;
      inPackages = keyMatch[2] === "packages";
      continue;
    }

    const itemMatch = line.match(listItemRegex);
    if (inPackages && itemMatch && itemMatch[1].length > packagesIndent) {
      patterns.push(itemMatch[2].replace(quotesRegex, ""));
    }
  }

  return patterns;
}

/** Workspace globs from `pnpm-workspace.yaml` and the `workspaces` field. */
export async function getWorkspacePatterns(cwd: string) {
  const patterns: string[] = [];
  const pnpmWorkspace = path.join(cwd, "pnpm-workspace.yaml");

  if (existsSync(pnpmWorkspace)) {
    patterns.push(
      ...parsePnpmWorkspacePackages(await readFile(pnpmWorkspace, "utf8"))
    );
  }

  const packageJson = await readPackageJson(cwd).catch(() => null);
  const workspaces = Array.isArray(packageJson?.workspaces)
    ? packageJson.workspaces
    : packageJson?.workspaces?.packages;

  patterns.push(...(workspaces ?? []));

  return [
    ...new Set(
      patterns.filter((pattern) => !pattern.startsWith("!") && pattern !== ".")
    ),
  ];
}

export async function hasFrameworkConfig(cwd: string) {
  const matches = await glob(FRAMEWORK_CONFIG_FILES, { cwd, deep: 1 });

  return matches.length > 0;
}

/**
 * A monorepo root that isn't an app itself, so components need a target
 * workspace. A `pnpm-workspace.yaml` without packages, like the one in a
 * standalone app, doesn't count.
 */
export async function isMonorepoRoot(cwd: string) {
  if (await hasFrameworkConfig(cwd)) {
    return false;
  }

  return (await getWorkspacePatterns(cwd)).length > 0;
}

/**
 * Workspaces that can receive components: apps with a framework config and
 * packages that depend on React, like a shared `packages/ui`.
 */
export async function getWorkspaceTargets(
  cwd: string
): Promise<WorkspaceTarget[]> {
  const patterns = await getWorkspacePatterns(cwd);

  if (patterns.length === 0) {
    return [];
  }

  const dirs = await glob(patterns, {
    cwd,
    ignore: ["**/node_modules/**"],
    onlyDirectories: true,
  });
  const targets = await Promise.all(
    dirs.sort().map(async (dir) => {
      const fullPath = path.resolve(cwd, dir);
      const packageJson = await readPackageJson(fullPath).catch(() => null);

      if (!packageJson) {
        return null;
      }

      const usesReact = Boolean(
        packageJson.dependencies?.react ??
          packageJson.peerDependencies?.react ??
          packageJson.devDependencies?.react
      );

      if (!(usesReact || (await hasFrameworkConfig(fullPath)))) {
        return null;
      }

      return { name: dir.replace(trailingSlashRegex, ""), path: fullPath };
    })
  );

  return targets.filter((target) => target !== null);
}
