import { existsSync } from "node:fs";
import path from "node:path";

export type PackageManager = "bun" | "npm" | "pnpm" | "yarn";

const LOCKFILES: [string, PackageManager][] = [
  ["pnpm-lock.yaml", "pnpm"],
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm"],
];

/** The package manager that ran the CLI, e.g. `pnpm` for `pnpm dlx time2code`. */
export function getUserAgentPackageManager(
  userAgent = process.env.npm_config_user_agent
): PackageManager | null {
  const name = userAgent?.split("/")[0];

  if (name === "pnpm" || name === "bun" || name === "yarn" || name === "npm") {
    return name;
  }

  return null;
}

/** The package manager of the project, from the closest lockfile. */
export function getPackageManager(cwd: string): PackageManager {
  let dir = path.resolve(cwd);
  let parent = dir;

  do {
    dir = parent;

    for (const [lockfile, packageManager] of LOCKFILES) {
      if (existsSync(path.join(dir, lockfile))) {
        return packageManager;
      }
    }

    parent = path.dirname(dir);
  } while (parent !== dir);

  return getUserAgentPackageManager() ?? "npm";
}

/** The command that runs a package without installing it. */
export function getPackageRunner(packageManager: PackageManager) {
  switch (packageManager) {
    case "pnpm":
      return "pnpm dlx";
    case "bun":
      return "bunx --bun";
    case "yarn":
      return "yarn dlx";
    default:
      return "npx";
  }
}
