import type { addRegistryItems } from "@shadcn/registry";

import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { parseTsconfig } from "get-tsconfig";

import { CliError } from "./errors";
import { getRegistryTemplate, REGISTRY_NAMESPACE } from "./registry";

export type RegistryConfig = NonNullable<
  NonNullable<Parameters<typeof addRegistryItems>[1]>["config"]
>;

export interface ProjectInfo {
  /** import alias of the source root, e.g. `@` for `"@/*": ["./src/*"]` */
  alias: string;
  /** absolute path of the Tailwind CSS entry file */
  cssFile: string;
  cwd: string;
  /** whether the app uses React Server Components (Next.js App Router) */
  rsc: boolean;
  /** directory the alias points to, `<cwd>/src` or `<cwd>` */
  sourceDir: string;
}

const TSCONFIG_FILES = ["tsconfig.json", "jsconfig.json"];

const CSS_CANDIDATES = [
  "src/app/globals.css",
  "app/globals.css",
  "src/styles/globals.css",
  "styles/globals.css",
  "src/index.css",
  "src/globals.css",
  "src/app.css",
];

const IGNORED_DIRS = new Set([
  ".git",
  ".next",
  ".turbo",
  "build",
  "dist",
  "node_modules",
  "out",
  "public",
]);

const tailwindImportRegex = /@import\s+["']tailwindcss["']/;
const wildcardSuffix = "/*";

export async function readPackageJson(cwd: string) {
  const file = path.join(cwd, "package.json");

  if (!existsSync(file)) {
    return null;
  }

  return JSON.parse(await readFile(file, "utf8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    name?: string;
    packageManager?: string;
    peerDependencies?: Record<string, string>;
    workspaces?: string[] | { packages?: string[] };
  };
}

/**
 * The alias that maps to the source root, read from the `paths` of the
 * project's own tsconfig (`extends` is followed).
 */
export function findSourceAlias(cwd: string) {
  const tsconfigPath = TSCONFIG_FILES.map((file) => path.join(cwd, file)).find(
    (file) => existsSync(file)
  );

  if (!tsconfigPath) {
    return null;
  }

  const { compilerOptions } = parseTsconfig(tsconfigPath);
  const baseDir = path.resolve(
    path.dirname(tsconfigPath),
    compilerOptions?.baseUrl ?? "."
  );
  const candidates = [path.join(cwd, "src"), cwd];

  for (const sourceDir of candidates) {
    for (const [key, targets] of Object.entries(compilerOptions?.paths ?? {})) {
      const [target] = targets;

      if (!(key.endsWith(wildcardSuffix) && target?.endsWith("*"))) {
        continue;
      }

      // `./src/*` and `*` (relative to baseUrl) both end in a wildcard
      const resolved = path.resolve(baseDir, target.slice(0, -1));

      if (resolved === sourceDir) {
        return { alias: key.slice(0, -2), sourceDir };
      }
    }
  }

  return null;
}

async function isTailwindEntry(file: string) {
  try {
    return tailwindImportRegex.test(await readFile(file, "utf8"));
  } catch {
    return false;
  }
}

async function findCssFiles(dir: string, depth: number): Promise<string[]> {
  if (depth < 0) {
    return [];
  }

  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !IGNORED_DIRS.has(entry.name)) {
        return findCssFiles(entryPath, depth - 1);
      }

      return entry.isFile() && entry.name.endsWith(".css") ? [entryPath] : [];
    })
  );

  return nested.flat();
}

/** The first file that imports Tailwind CSS, in the order given. */
async function findTailwindEntry(files: string[]) {
  const matches = await Promise.all(files.map(isTailwindEntry));

  return files[matches.indexOf(true)] ?? null;
}

/** The CSS file that imports Tailwind CSS, where theme variables are merged. */
export async function findTailwindCss(cwd: string) {
  return (
    (await findTailwindEntry(
      CSS_CANDIDATES.map((candidate) => path.join(cwd, candidate))
    )) ?? (await findTailwindEntry(await findCssFiles(cwd, 4)))
  );
}

/**
 * Detects everything the installer needs from the project itself, so no
 * config file is required.
 */
export async function getProjectInfo(cwd: string): Promise<ProjectInfo> {
  const packageJson = await readPackageJson(cwd);

  if (!packageJson) {
    throw new CliError(`No package.json found in ${cwd}.`, {
      hint: "Run the command inside your project, pass --cwd, or start a new project with `time2code create`.",
    });
  }

  const source = findSourceAlias(cwd);

  if (!source) {
    throw new CliError(
      "Could not find an import alias for your source directory.",
      {
        hint: 'Add one to the "paths" of your tsconfig.json, e.g. "@/*": ["./src/*"].',
      }
    );
  }

  const cssFile = await findTailwindCss(cwd);

  if (!cssFile) {
    throw new CliError("Could not find your Tailwind CSS file.", {
      hint: 'Components need Tailwind CSS v4: add `@import "tailwindcss";` to your global CSS file.',
    });
  }

  const hasNext = Boolean(
    packageJson.dependencies?.next ?? packageJson.devDependencies?.next
  );
  const rsc = hasNext && existsSync(path.join(source.sourceDir, "app"));

  return { ...source, cssFile, cwd, rsc };
}

/**
 * The config the shadcn registry engine expects, built in memory instead of
 * read from `components.json`. Components follow the default layout:
 * `components/ui`, `components/*`, `hooks` and `lib` under the source root.
 * `registryTemplate` is where the `@time2code` namespace resolves.
 */
export function createRegistryConfig(
  project: ProjectInfo,
  registryTemplate = getRegistryTemplate()
): RegistryConfig {
  const { alias, cssFile, cwd, rsc, sourceDir } = project;

  return {
    aliases: {
      components: `${alias}/components`,
      hooks: `${alias}/hooks`,
      lib: `${alias}/lib`,
      ui: `${alias}/components/ui`,
      utils: `${alias}/lib/utils`,
    },
    registries: { [REGISTRY_NAMESPACE]: registryTemplate },
    resolvedPaths: {
      components: path.join(sourceDir, "components"),
      cwd,
      hooks: path.join(sourceDir, "hooks"),
      lib: path.join(sourceDir, "lib"),
      tailwindConfig: "",
      tailwindCss: cssFile,
      ui: path.join(sourceDir, "components/ui"),
      utils: path.join(sourceDir, "lib/utils"),
    },
    rsc,
    style: "time2code",
    // An empty base color skips fetching shadcn's color palettes.
    tailwind: {
      baseColor: "",
      config: "",
      css: path.relative(cwd, cssFile),
      cssVariables: true,
      prefix: "",
    },
    tsx: true,
  };
}
