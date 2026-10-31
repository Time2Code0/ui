import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { type AddOptions, runAdd } from "../src/commands/add";
import { createFixture, nextAppFiles } from "./helpers/fixtures";
import {
  type RegistryServer,
  startRegistryServer,
} from "./helpers/registry-server";

let registry: RegistryServer;
let options: Omit<AddOptions, "cwd">;

beforeAll(async () => {
  registry = await startRegistryServer();
  options = {
    interactive: false,
    overwrite: false,
    registry: registry.url,
    silent: true,
  };
});

afterAll(async () => {
  await registry.close();
});

const read = (cwd: string, file: string) =>
  readFile(path.join(cwd, file), "utf8");

describe("runAdd", () => {
  it("installs items and their registry dependencies without a config file", async () => {
    const cwd = await createFixture(nextAppFiles());

    await runAdd(["button", "use-toggle"], { ...options, cwd });

    expect(existsSync(path.join(cwd, "src/components/ui/button.tsx"))).toBe(
      true
    );
    expect(existsSync(path.join(cwd, "src/components/ui/loading.tsx"))).toBe(
      true
    );
    expect(existsSync(path.join(cwd, "src/hooks/use-toggle.ts"))).toBe(true);
    expect(existsSync(path.join(cwd, "components.json"))).toBe(false);
  });

  it("rewrites registry imports to the project alias", async () => {
    const cwd = await createFixture(nextAppFiles());

    await runAdd(["beam"], { ...options, cwd });

    expect(await read(cwd, "src/components/marketing/beam.tsx")).toContain(
      'from "@/components/ui/button"'
    );
    expect(await read(cwd, "src/components/ui/button.tsx")).toContain(
      'from "./loading"'
    );
  });

  it("merges theme variables and keyframes into the Tailwind CSS file", async () => {
    const cwd = await createFixture(nextAppFiles());

    await runAdd(["beam"], { ...options, cwd });

    const css = await read(cwd, "src/styles/globals.css");
    expect(css).toContain("--animate-beam: beam 2s linear infinite");
    expect(css).toContain("@keyframes beam");
  });

  it("puts pages into the app directory under src", async () => {
    const cwd = await createFixture(nextAppFiles());

    await runAdd(["login-01"], { ...options, cwd });

    expect(await read(cwd, "src/app/login/page.tsx")).toContain(
      'from "@/components/login-01/login-form"'
    );
  });

  it("keeps existing files unless overwrite is set", async () => {
    const cwd = await createFixture(
      nextAppFiles({ "src/hooks/use-toggle.ts": "// mine\n" })
    );

    await runAdd(["use-toggle"], { ...options, cwd });
    expect(await read(cwd, "src/hooks/use-toggle.ts")).toBe("// mine\n");

    await runAdd(["use-toggle"], { ...options, cwd, overwrite: true });
    expect(await read(cwd, "src/hooks/use-toggle.ts")).toContain("useToggle");
  });

  it("requires item names without a terminal", async () => {
    const cwd = await createFixture(nextAppFiles());

    await expect(runAdd([], { ...options, cwd })).rejects.toThrow(
      "Name the components to add"
    );
  });

  describe("in a monorepo", () => {
    const monorepo = () =>
      createFixture({
        ...Object.fromEntries(
          Object.entries(nextAppFiles()).map(([file, content]) => [
            `apps/web/${file}`,
            content,
          ])
        ),
        "package.json": { name: "root" },
        "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
        "pnpm-workspace.yaml": "packages:\n  - apps/*\n",
      });

    it("asks for the workspace and lists the --cwd options", async () => {
      const cwd = await monorepo();
      const error = await runAdd(["button"], { ...options, cwd }).catch(
        (caught) => caught
      );

      expect(error.message).toContain("monorepo root");
      expect(error.hint).toContain("--cwd apps/web");
    });

    it("installs into the workspace passed with --cwd", async () => {
      const root = await monorepo();
      const cwd = path.join(root, "apps/web");

      await runAdd(["button"], { ...options, cwd });

      expect(existsSync(path.join(cwd, "src/components/ui/button.tsx"))).toBe(
        true
      );
    });
  });
});
