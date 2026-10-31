import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  createRegistryConfig,
  findTailwindCss,
  getProjectInfo,
} from "../src/utils/project";
import { createFixture, nextAppFiles } from "./helpers/fixtures";

describe("getProjectInfo", () => {
  it("detects the alias, src directory, CSS file and RSC", async () => {
    const cwd = await createFixture(nextAppFiles());

    expect(await getProjectInfo(cwd)).toEqual({
      alias: "@",
      cssFile: path.join(cwd, "src/styles/globals.css"),
      cwd,
      rsc: true,
      sourceDir: path.join(cwd, "src"),
    });
  });

  it("supports projects without a src directory and other aliases", async () => {
    const cwd = await createFixture({
      "app/globals.css": "@import 'tailwindcss';\n",
      "package.json": { dependencies: { react: "19.3.0" } },
      "tsconfig.json": {
        compilerOptions: { baseUrl: ".", paths: { "~/*": ["*"] } },
      },
    });

    expect(await getProjectInfo(cwd)).toMatchObject({
      alias: "~",
      cssFile: path.join(cwd, "app/globals.css"),
      rsc: false,
      sourceDir: cwd,
    });
  });

  it("follows extends to find the paths", async () => {
    const cwd = await createFixture({
      "package.json": {},
      "src/index.css": '@import "tailwindcss";\n',
      "tsconfig.base.json": {
        compilerOptions: { paths: { "#/*": ["./src/*"] } },
      },
      "tsconfig.json": { extends: "./tsconfig.base.json" },
    });

    expect(await getProjectInfo(cwd)).toMatchObject({
      alias: "#",
      sourceDir: path.join(cwd, "src"),
    });
  });

  it("explains how to fix a missing package.json, alias or CSS file", async () => {
    const empty = await createFixture({});
    await expect(getProjectInfo(empty)).rejects.toThrow("No package.json");

    const noAlias = await createFixture(nextAppFiles({ "tsconfig.json": {} }));
    await expect(getProjectInfo(noAlias)).rejects.toThrow("import alias");

    const noCss = await createFixture(
      nextAppFiles({ "src/styles/globals.css": "body {}\n" })
    );
    await expect(getProjectInfo(noCss)).rejects.toThrow("Tailwind CSS file");
  });
});

describe("findTailwindCss", () => {
  it("finds the entry outside the usual locations", async () => {
    const cwd = await createFixture({
      "node_modules/pkg/style.css": '@import "tailwindcss";\n',
      "src/theme/base.css": "body {}\n",
      "src/theme/main.css": '@import "tailwindcss" source(none);\n',
    });

    expect(await findTailwindCss(cwd)).toBe(
      path.join(cwd, "src/theme/main.css")
    );
  });
});

describe("createRegistryConfig", () => {
  it("installs into components/ui, components, hooks and lib", async () => {
    const cwd = await createFixture(nextAppFiles());
    const config = createRegistryConfig(await getProjectInfo(cwd));

    expect(config.aliases).toEqual({
      components: "@/components",
      hooks: "@/hooks",
      lib: "@/lib",
      ui: "@/components/ui",
      utils: "@/lib/utils",
    });
    expect(config.resolvedPaths).toMatchObject({
      components: path.join(cwd, "src/components"),
      hooks: path.join(cwd, "src/hooks"),
      ui: path.join(cwd, "src/components/ui"),
    });
    expect(config.tailwind?.css).toBe("src/styles/globals.css");
  });
});
