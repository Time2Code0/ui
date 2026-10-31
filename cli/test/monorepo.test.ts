import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  getWorkspaceTargets,
  isMonorepoRoot,
  parsePnpmWorkspacePackages,
} from "../src/utils/monorepo";
import { createFixture, nextAppFiles } from "./helpers/fixtures";

describe("parsePnpmWorkspacePackages", () => {
  it("reads the package globs and ignores other keys", () => {
    const content = `packages:
  - "apps/*"
  - 'packages/*' # shared code
  - site

ignoredBuiltDependencies:
  - sharp
`;

    expect(parsePnpmWorkspacePackages(content)).toEqual([
      "apps/*",
      "packages/*",
      "site",
    ]);
  });
});

describe("isMonorepoRoot", () => {
  it("is true for pnpm and npm workspaces", async () => {
    const pnpm = await createFixture({
      "package.json": {},
      "pnpm-workspace.yaml": "packages:\n  - apps/*\n",
    });
    const npm = await createFixture({
      "package.json": { workspaces: ["apps/*"] },
    });

    expect(await isMonorepoRoot(pnpm)).toBe(true);
    expect(await isMonorepoRoot(npm)).toBe(true);
  });

  it("is false for a standalone app with a pnpm-workspace.yaml", async () => {
    const cwd = await createFixture(
      nextAppFiles({
        "pnpm-workspace.yaml": "ignoredBuiltDependencies:\n  - sharp\n",
      })
    );

    expect(await isMonorepoRoot(cwd)).toBe(false);
  });
});

describe("getWorkspaceTargets", () => {
  it("lists apps and React packages", async () => {
    const cwd = await createFixture({
      "apps/docs/package.json": { name: "docs" },
      "apps/docs/vite.config.ts": "export default {};\n",
      "apps/web/next.config.ts": "export default {};\n",
      "apps/web/package.json": { name: "web" },
      "package.json": {},
      "packages/config/package.json": { name: "config" },
      "packages/ui/package.json": { peerDependencies: { react: "*" } },
      "pnpm-workspace.yaml": "packages:\n  - apps/*\n  - packages/*\n",
    });

    expect(await getWorkspaceTargets(cwd)).toEqual([
      { name: "apps/docs", path: path.join(cwd, "apps/docs") },
      { name: "apps/web", path: path.join(cwd, "apps/web") },
      { name: "packages/ui", path: path.join(cwd, "packages/ui") },
    ]);
  });
});
