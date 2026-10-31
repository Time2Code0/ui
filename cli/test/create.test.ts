import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { x } from "tinyexec";
import { afterEach, describe, expect, it, vi } from "vitest";

import { type CreateOptions, runCreate } from "../src/commands/create";
import { createFixture } from "./helpers/fixtures";

const options: Omit<CreateOptions, "cwd"> = {
  git: false,
  install: false,
  interactive: false,
};

/** A template like next-starter-template, with a local build left over. */
const templateFiles = () =>
  createFixture({
    ".next/cache.json": "{}",
    "node_modules/pkg/index.js": "",
    "package.json": {
      name: "next-starter-template",
      packageManager: "pnpm@10.33.4",
    },
    "pnpm-workspace.yaml": "ignoredBuiltDependencies:\n  - sharp\n",
    "src/app/page.tsx": "export default function Page() {}\n",
  });

const readPackageJson = async (dir: string) =>
  JSON.parse(await readFile(path.join(dir, "package.json"), "utf8"));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("runCreate", () => {
  it("copies a local template and names the project", async () => {
    vi.stubEnv("TIME2CODE_TEMPLATE_DIR", await templateFiles());
    const cwd = await createFixture({});

    const result = await runCreate("my-app", {
      ...options,
      cwd,
      packageManager: "pnpm",
    });

    expect(result).toMatchObject({
      projectPath: path.join(cwd, "my-app"),
      template: "next",
    });
    expect(await readPackageJson(result.projectPath)).toEqual({
      name: "my-app",
      packageManager: "pnpm@10.33.4",
    });
    expect(existsSync(path.join(result.projectPath, "src/app/page.tsx"))).toBe(
      true
    );
    expect(existsSync(path.join(result.projectPath, "node_modules"))).toBe(
      false
    );
    expect(existsSync(path.join(result.projectPath, ".next"))).toBe(false);
  });

  it("drops pnpm files for other package managers", async () => {
    vi.stubEnv("TIME2CODE_TEMPLATE_DIR", await templateFiles());
    const cwd = await createFixture({});

    const { projectPath } = await runCreate("npm-app", {
      ...options,
      cwd,
      packageManager: "npm",
    });

    expect((await readPackageJson(projectPath)).packageManager).toBeUndefined();
    expect(existsSync(path.join(projectPath, "pnpm-workspace.yaml"))).toBe(
      false
    );
  });

  it("clones the template repository without its history", async () => {
    const repo = await createFixture({
      "package.json": { name: "next-starter-template" },
      "src/app/page.tsx": "export default function Page() {}\n",
    });
    const git = (args: string[]) =>
      x("git", args, { nodeOptions: { cwd: repo }, throwOnError: true });
    await git(["init", "--quiet"]);
    await git(["add", "-A"]);
    await git([
      "-c",
      "user.name=test",
      "-c",
      "user.email=test@example.com",
      "commit",
      "--quiet",
      "-m",
      "init",
    ]);
    vi.stubEnv("TIME2CODE_TEMPLATE_DIR", "");
    vi.stubEnv("TIME2CODE_TEMPLATE_REPO", pathToFileURL(repo).href);
    const cwd = await createFixture({});

    const { projectPath } = await runCreate("cloned", {
      ...options,
      cwd,
      packageManager: "pnpm",
    });

    expect(await readPackageJson(projectPath)).toEqual({ name: "cloned" });
    expect(existsSync(path.join(projectPath, "src/app/page.tsx"))).toBe(true);
    expect(existsSync(path.join(projectPath, ".git"))).toBe(false);
  });

  it("removes the project directory when cloning fails", async () => {
    vi.stubEnv("TIME2CODE_TEMPLATE_DIR", "");
    vi.stubEnv(
      "TIME2CODE_TEMPLATE_REPO",
      pathToFileURL(path.join(await createFixture({}), "missing")).href
    );
    const cwd = await createFixture({});

    await expect(runCreate("app", { ...options, cwd })).rejects.toThrow(
      "Could not clone the template"
    );
    expect(existsSync(path.join(cwd, "app"))).toBe(false);
  });

  it("rejects invalid names, unknown templates and non-empty directories", async () => {
    vi.stubEnv("TIME2CODE_TEMPLATE_DIR", await templateFiles());
    const cwd = await createFixture({ "taken/file.txt": "" });

    await expect(runCreate("My App", { ...options, cwd })).rejects.toThrow(
      "Invalid project name"
    );
    await expect(
      runCreate("app", { ...options, cwd, template: "astro" })
    ).rejects.toThrow('Unknown template "astro"');
    await expect(runCreate("taken", { ...options, cwd })).rejects.toThrow(
      "is not empty"
    );
    await expect(runCreate(undefined, { ...options, cwd })).rejects.toThrow(
      "Name the project"
    );
  });
});
